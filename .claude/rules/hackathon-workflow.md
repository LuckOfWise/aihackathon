# ハッカソン開発ワークフロー（最優先・全エージェント必読）

**当日のモード**: 残り3時間で動くものを作る。**速度 > 完全性**。

このドキュメントは `git-workflow.md` を含む他の git 関連ルールに**優先する**。矛盾する場合はこちらに従う。

## 鉄則 (絶対遵守 / 全エージェント共通)

1. **必ず最新 main から worktree を生やして開発する**（メインリポジトリで作業しない）
2. **開発が終わったら必ず commit → push → PR 作成** まで実行する
3. **main への直接コミットは、ユーザーから明示的に指示されたら躊躇なく実行**する
4. **`bin/ci` / lint / テストは「速度優先」のため省略可**（PR 作成までで OK）。ただし lint エラーで CI が真っ赤になりそうなら最小限の修正は入れる
5. **design 系スキルや /plan は複雑な機能のみ**。小さい変更は即実装

## 標準フロー（feature 開発）

### 起動

```bash
# ① 最新 main を取得（必ず実行）
bin/hack-start <branch-name>

# 例: bin/hack-start feat/chat-ui
# → .claude/worktrees/<branch-name> に worktree が作成され、
#   そのパスが標準出力される。以降の作業はそのパス内で行う。
```

### 作業

worktree 内で実装。複数のサブエージェント (backend / frontend) を起動する場合も**同じ worktree パス内**で動かす。

サブエージェントを起動する際のプロンプト冒頭に必ず書く：

> 作業ディレクトリ: `<worktree のフルパス>`
> このパスから出ないこと。`git checkout` でブランチを切り替えないこと。

### 完了

```bash
# ② コミット → push → PR 作成
bin/hack-finish "<pr title>" "[optional body]"

# 例: bin/hack-finish "feat: chat UI のスケルトン" "ChatBubble + ChatInput のページを追加"
```

`bin/hack-finish` は以下を順番に実行する:

1. `git add -A`（worktree 全体）
2. `git commit -m "<title>"`（既にステージ済みでも未ステージでもまとめてコミット）
3. `git push -u origin <branch>`
4. `gh pr create --title "<title>" --body "<body>" --base main`
5. PR URL を表示

PR を作るところまでが「開発完了」。**マージはユーザーが判断**。

## main 直接コミット（指示があった場合のみ）

ユーザーから「main に直接コミットしていい」「直 push でいい」「hotfix」等と指示されたら、**確認せず即実行**する。

```bash
# main に切り替え（メインリポジトリで作業）
git checkout main
git pull --rebase origin main
# 実装...
git add -A && git commit -m "<message>"
git push origin main
```

**force push は禁止**（事故防止）。ユーザーが force push を明示的に求めた場合のみ実行。

## 並列開発（複数 worktree）

別ブランチで並列開発する場合は worktree を複数生やす:

```bash
bin/hack-start feat/foo   # → .claude/worktrees/feat-foo
bin/hack-start feat/bar   # → .claude/worktrees/feat-bar
```

それぞれ別エージェントに別 worktree を割り当てて並列実行できる。

## QA セッション（別セッション・別 worktree）

開発セッションが PR を量産するのと並行して、別セッションで `/watch-pr` を回し、**main 向け PR を順次レビュー & プレビュー動作確認 & マージ**する。

```bash
# QA セッションで:
/loop 90 /watch-pr
```

- 専用 worktree: `.claude/worktrees/qa-review`
- COMPOSE_PROJECT_NAME と preview port が他 worktree と分離されているので衝突しない
- 方針: **main 向け PR は CRITICAL 問題が無い限り全て取り込む**
- プレビュー動作確認は省略しない（[.claude/rules/preview-verification.md](./preview-verification.md)）
- 詳細フロー: [.claude/commands/watch-pr.md](../commands/watch-pr.md)

開発セッションは worktree (`.claude/worktrees/feat-*`) で実装 → PR 作成までやれば、後は QA セッションが拾ってマージしてくれる。

## 速度優先チェックリスト（残り時間別）

### 残り 2 時間以上
- [ ] 最低限のテスト（model spec のみ）
- [ ] design 4 原則だけ目視確認
- [ ] PR 作成 → 自分でマージ判断

### 残り 1 時間以下
- [ ] テストはスキップして OK
- [ ] lint 修正は CI 赤を防ぐ最小限
- [ ] PR 作成 → 即マージで OK（指示があれば main 直 push）

### 残り 30 分以下
- [ ] **動くこと**だけ確認
- [ ] main 直 push を躊躇しない（ユーザーが許可していれば）

## 禁止事項（このモードでも絶対に守る）

- main への force push
- `--no-verify` での hook スキップ（hook が失敗したら原因を直す）
- secrets / credentials のコミット (`config/credentials/*.key` 等)
- `.env` 系ファイルのコミット

## エージェント間で徹底する仕組み

各サブエージェント定義（`.claude/agents/*.md`）の冒頭で本ドキュメント (`hackathon-workflow.md`) を**必読**として宣言している。エージェント起動時には必ず最初に読むこと。

複数エージェント並列実行時は、親エージェントが各サブエージェントに **作業 worktree パス** を明示的に渡す。
