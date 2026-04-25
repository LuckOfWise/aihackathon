# /watch-pr

オープン中の **main 向け PR** をチェックし、未レビューまたは更新された PR があればレビュー + プレビュー動作確認を実行し、APPROVE → マージまで自動で行います。

ハッカソン当日のため **main への PR は全て取り込む方針**。CRITICAL なセキュリティ問題が無い限り approve & merge する。

`/loop 90 /watch-pr` で 90 秒間隔の自動監視が可能です。

## 前提

- このリポジトリには `main` ブランチしか存在しない（development/staging は無い）
- preview 環境は worktree ごとに別ポート・別 Docker compose プロジェクト（[`.claude/rules/preview-verification.md`](../rules/preview-verification.md) 参照）
- QA セッションは専用 worktree (`.claude/worktrees/qa-review`) で動かす

## 実行手順

### 1. レビュー済み記録ファイルの準備

```bash
touch ~/.aihackathon-pr-review-seen
cat ~/.aihackathon-pr-review-seen
```

形式: `PR番号:headRefOid` を 1 行ずつ。

### 2. QA worktree の準備（初回のみ）

```bash
# repo root で実行
if [ ! -d .claude/worktrees/qa-review ]; then
  git fetch origin main --quiet
  git worktree add -b qa-review .claude/worktrees/qa-review origin/main 2>/dev/null \
    || git worktree add .claude/worktrees/qa-review qa-review
fi
```

以降の git/gh 操作は **`.claude/worktrees/qa-review` の中で実行する**。

### 3. オープン中の PR 一覧を取得

```bash
gh pr list --base main --state open \
  --json number,title,headRefName,baseRefName,author,createdAt,labels,headRefOid,isDraft
```

- `isDraft: true` の PR は対象外（スキップ）
- `author.login` が `dependabot[bot]` でも対象（依存更新も取り込む方針）

### 4. 未レビュー PR の特定

取得した PR 一覧から、`~/.aihackathon-pr-review-seen` に `PR番号:headRefOid` が記録されていない PR を特定する。

- 同じ PR 番号でも `headRefOid`（最新コミット SHA）が異なれば再レビュー対象
- すべてレビュー済みの場合は「新規・更新 PR はありません」と報告して終了

### 5. 未レビュー PR ごとにレビュー実行

QA worktree (`.claude/worktrees/qa-review`) 内で、各 PR について以下を実行。

#### a. PR チェックアウト

```bash
gh pr checkout <PR番号>
gh pr diff <PR番号> --name-only
```

ブランチ切替により `bin/dev-preview` 起動時に `bin/setup-preview` が走り、`.claude/launch.json` がそのブランチ用に再生成される。

diff から **変更カテゴリ** を判定:

| カテゴリ | 判定条件 |
|---------|---------|
| `deps-only` | `Gemfile`, `Gemfile.lock`, `package.json`, `yarn.lock` のみ |
| `migration` | `db/migrate/**`, `db/schema.rb` を含む |
| `ruby` | `.rb` を含む |
| `erb` | `.erb` / `.html.erb` を含む |
| `view-or-css` | `app/views/**`, `app/assets/**`, `app/components/**` を含む |
| `controller-or-route` | `app/controllers/**`, `config/routes.rb` を含む |
| `js` | `app/frontend/**`, `*.ts`, `*.js` を含む |

#### b. 依存・DB 準備（条件付き）

```bash
# Gemfile.lock 変更時
docker compose -f docker-compose.dev.yml exec -T web bundle install

# package.json/yarn.lock 変更時
docker compose -f docker-compose.dev.yml exec -T web yarn install

# migration を含む場合
docker compose -f docker-compose.dev.yml exec -T web bin/rails db:prepare
```

Docker compose が起動していない場合は `bin/dev-preview` をバックグラウンド起動するか、`docker compose -f docker-compose.dev.yml up -d` で先に上げておく。

#### c. コードレビュー

```bash
gh pr diff <PR番号>
```

レビュー観点（ハッカソンモード — CRITICAL のみブロッカー扱い）:

- **CRITICAL（block）**:
  - Strong Parameters 漏れ・SQL インジェクション・XSS
  - 認証/認可バイパス
  - secrets コミット
  - Rails 標準 enum の使用（Enumerize 必須）
  - `app/services/` ディレクトリの新設（Form Object / Agent / モデルに置く）
- **HIGH（指摘のみ）**: N+1、不適切なインデックス、margin の外部制御違反
- **MEDIUM（指摘のみ）**: 命名、Fat Controller の兆候

参照: `.claude/rules/coding-style.md`, `.claude/rules/frameworks/rails*.md`

#### d. プレビュー動作確認（**必須・しっかり実施**）

[`.claude/rules/preview-verification.md`](../rules/preview-verification.md) に従う。**ハッカソンでもここはケチらない**（ユーザー要件）。

最低限の流れ:

1. `mcp__Claude_Preview__preview_start` で起動（hook で setup-preview が動く）
2. 戻り値の `port` を控える
3. PR の主要画面を `preview_snapshot` / `preview_screenshot` で確認
4. フォーム変更があれば**バリデーション・登録・編集・削除**を実操作
5. `preview_console_logs` / `preview_network` でエラーチェック

`deps-only` の PR でもトップページの疎通確認は行う（依存更新で起動できなくなることがある）。

#### e. テスト実行（条件付き）

```bash
# ruby/erb/migration 変更を含む場合
docker compose -f docker-compose.dev.yml exec -T web bin/rspec <変更ファイルに関連する spec>

# 影響範囲が広い場合のみ
docker compose -f docker-compose.dev.yml exec -T web bin/rspec
```

**既存失敗との切り分け**: spec 失敗が出た場合、main で同じ失敗が再現するか確認:

```bash
git stash --include-untracked 2>/dev/null
git checkout main
git pull origin main --quiet
docker compose -f docker-compose.dev.yml exec -T web bin/rspec <失敗した spec>
git checkout - --quiet
git stash pop 2>/dev/null || true
```

main でも失敗するなら本 PR 起因ではないので approve を妨げない。

ハッカソンモードでテストが書かれていない PR は spec 実行をスキップしてよい（プレビュー動作確認で代替）。

#### f. 静的チェック（CI 必須項目を再現）

```bash
# CI で必須なのは scan_ruby + lint のみ
bin/brakeman --no-pager        # ruby を含む変更のみ
bin/bundler-audit              # deps-only / Gemfile.lock 変更時
bin/rubocop                    # ruby/erb 変更時
```

これらが通らないと CI が赤くなりマージブロックされるので、ローカルで通しておく。

#### g-fix. レビュー指摘の自動修正

CRITICAL/HIGH の指摘で修正可能なもの（残存参照・lint 違反・未使用コード等）は自分で修正:

```bash
git add <修正ファイル>
git commit -m "fix: <修正内容>"
git push origin <PRブランチ>
```

**design 系の改善（4 原則・Density Ladder 等）は時間に応じて判断**。指摘だけに留めて approve でも OK。

修正不可（設計変更・要件確認が必要）な CRITICAL は PR コメントで報告し approve を保留する:

```bash
gh pr comment <PR番号> --body "..."
```

#### h. APPROVE & マージ

CRITICAL が無く CI が通っている前提で、approve → マージを実行する。

```bash
# Approve
gh pr review <PR番号> --approve --body "$(cat <<'EOF'
QA 確認済み。

- コードレビュー: CRITICAL なし
- プレビュー動作確認: <主要画面の確認内容を 1-2 行>
- テスト: <pass / skip / 既存失敗のみ>
- CI: <green / pending>
EOF
)"

# CI 状態確認
gh pr checks <PR番号>
```

**必須 CI チェック**: `scan_ruby`, `lint`（`.github/workflows/ci.yml` 参照）。
**非必須 / 無視 OK**: `claude-review`, `claude-implement`, `claude-mention` 等の補助 action。

CI が `success` なら即マージ:

```bash
gh pr merge <PR番号> --merge --delete-branch
```

CI が `pending` / `in_progress` の場合は最大 5 分待機 → 完了次第マージ。それでも完了しない場合は PR コメントに「CI 完了後に手動マージしてください」と記載してスキップ。

#### i. レビュー済み記録

```bash
echo "<PR番号>:<headRefOid>" >> ~/.aihackathon-pr-review-seen
```

### 6. main の最新化（マージ後）

少なくとも 1 件マージした場合、QA worktree の main を進めておく（次の PR レビューに影響するため）:

```bash
# repo root の main は他セッションが開発中なので触らない
# QA worktree 内で
git fetch origin main --quiet
```

`gh pr checkout` で次の PR に切り替わる際に自動で base が更新されるので明示的な merge/rebase は不要。

### 7. 完了報告

処理した PR の一覧と結果をまとめて報告:

```
✅ 処理完了
- #12 feat: chat UI のスケルトン → APPROVE & MERGED
- #13 fix: typo → APPROVE & MERGED (deps-only, preview skip → トップ疎通のみ)
- #14 feat: 新エージェント追加 → APPROVE 済み・CI 待ち（手動マージ依頼）

⏭️ スキップ
- #15 (Draft)

⚠️ 既存失敗
- #16 で failing spec があったが main でも同じ失敗 → approve 済み
```

## 並列実行の注意

`/watch-pr` は単一 QA セッション専用。並列で複数の `/watch-pr` を回さないこと（同じ QA worktree を奪い合うため）。

ただし、main セッションが feature 開発で別 worktree (`.claude/worktrees/feat-*`) を使っているのと並行して、QA セッションが `.claude/worktrees/qa-review` で動くのは問題なし（COMPOSE_PROJECT_NAME と port が分離されている）。

## トラブルシュート

| 現象 | 対処 |
|-----|------|
| `gh pr checkout` で「working tree has changes」 | `git stash --include-untracked && gh pr checkout <num>` |
| preview_start でポート衝突 | `.claude/launch.json` を削除して再起動（`bin/setup-preview` で再生成） |
| Docker container が古い | `docker compose -f docker-compose.dev.yml down && bin/dev-preview` |
| spec が DB 関連で落ちる | `docker compose -f docker-compose.dev.yml exec -T web bin/rails db:prepare` |
| CI の `lint` が `.rubocop_todo.yml` 変更で落ちる | `bin/rubocop -A` で auto-fix → push |
