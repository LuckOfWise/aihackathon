# AI Hackathon — Project Charter

このプロジェクトは **SG流・Claude協働前提** のRailsアプリ立ち上げ指示書に基づいて構築されている。

## 🏁 ハッカソンモード（当日 / 最優先）

**今日はハッカソン本番。残り時間は限られている。速度を最優先**。

詳細は **[.claude/rules/hackathon-workflow.md](.claude/rules/hackathon-workflow.md)** に集約。全エージェント必読。

**鉄則**:
1. 必ず `bin/hack-start <branch>` で**最新 main から worktree** を生やして開発
2. 完了後は必ず `bin/hack-finish "<title>"` で **commit → push → PR 作成**まで実行
3. main 直接コミットは**ユーザー指示時のみ**躊躇なく実行（`git checkout main && git pull && commit && push`）
4. テスト・lint・design レビューは速度に応じて省略可（CI 真っ赤を避ける最低限のみ）
5. サブエージェントを起動するときは、プロンプトに**作業 worktree のフルパス**を必ず明記する

通常の「拡張サイクル / 軽量サイクル」（後述）はハッカソン終了後の通常開発時に従うルール。当日は上記が優先。

## プロジェクト概要

- **目的**: AIハッカソン向けのRailsベースアプリケーション
- **UIアーキテクチャ**: Pattern A — Hotwire（Turbo + Stimulus）+ Vite
- **テンプレートエンジン**: ERB
- **非同期ライブラリ**: SolidQueue / SolidCache / SolidCable（Rails 8標準）
- **認証**: Devise
- **認可**: ActionPolicy
- **UIプロフィール**: base

## 技術スタック

| 層 | 選定 |
|---|---|
| Ruby | **4.0.2**（`.ruby-version` / `.tool-versions` で固定） |
| Rails | **8.1.3** |
| Node.js | **25.9.0**（`.node-version` / `.tool-versions` で固定） |
| パッケージマネージャー | yarn 1.22.22 |
| DB | PostgreSQL |
| Asset pipeline | Propshaft |
| CSS | Dart Sass（`dartsass-rails`） |
| JS bundler | Vite（`vite_rails` + `vite-plugin-ruby`） |
| Hotwire | `turbo-rails` / `stimulus-rails` |
| UI | ViewComponent、SimpleForm |
| モデル支援 | Enumerize、Draper、Ransack、Kaminari |
| **AI / Agent** | **[ActiveAgent](https://github.com/activeagents/activeagent)** — "Agents are Controllers" な Rails 向け AI フレームワーク |
| **LLM Provider** | **Anthropic**（`anthropic` gem）— デフォルトモデル `claude-sonnet-4-5` |
| 監視 | Sentry（`sentry-ruby` / `sentry-rails`）、Lograge |
| テスト | RSpec、FactoryBot、Capybara、Selenium |
| Lint | sgcop（RuboCop）、erb_lint、ESLint、Stylelint、TypeScript |
| Security | Brakeman、bundler-audit |
| Git hooks | lefthook |

## よく使うコマンド

| コマンド | 用途 |
|---|---|
| `bin/setup` | 初期セットアップ（DB + 依存 + dev server 起動） |
| `bin/dev` | 開発サーバー（foreman で web + vite） |
| `bin/test` | RSpec 実行 |
| `bin/lint` | rubocop + erb_lint + eslint + stylelint + tsc |
| `bin/ci` | lint + test + brakeman + bundler-audit（CI と同等） |
| `bin/rails ...` | Rails CLI |

**原則**: CIで起きる失敗は `bin/ci` で再現できるようにする。PR作成前にローカルで `bin/ci` を通してから push する。

## ディレクトリ配置

```
aihackathon/
├── CLAUDE.md                           # このファイル（プロジェクト憲法）
├── .claude/
│   ├── rules/                          # コーディングルール（SG共通 + 本プロジェクト独自）
│   │   ├── styles.md
│   │   ├── coding-style.md
│   │   ├── git-workflow.md
│   │   ├── languages/, frameworks/, integrations/
│   │   └── design/
│   │       ├── principles.md           # 【普遍】4原則 + SaaSクリシェ回避 + ボタン階層
│   │       ├── principles.examples.md
│   │       ├── ui-ux.md                # 【プロジェクト固有】
│   │       └── ui-ux.examples.md
│   ├── agents/                         # planner / backend / frontend / reviewer / security-reviewer
│   └── commands/                       # plan / test / code-review / build-fix / verify
├── .github/
│   ├── workflows/ci.yml                # scan_ruby / lint_ruby / test / frontend の4並列
│   └── dependabot.yml                  # gem / npm / actions 更新追随
├── app/
│   ├── assets/stylesheets/
│   │   ├── application.scss
│   │   ├── initializers/_variables.scss
│   │   ├── base/{_reset, _typography, _ja-text}.scss
│   │   ├── layout/_layout.scss
│   │   ├── components/{_button, _badge, _alert}.scss
│   │   └── views/_<block-name>.scss    # 1ファイル = 1 Block
│   ├── agents/                         # ActiveAgent (AI Agent-Oriented Programming)
│   ├── components/ui/                  # ViewComponent
│   ├── forms/                          # Form Object（ApplicationForm 継承）
│   ├── queries/                        # Query Object（ApplicationQuery 継承）
│   ├── policies/                       # ActionPolicy
│   └── frontend/
│       ├── entrypoints/application.js
│       └── controllers/                # Stimulus controllers
├── bin/{setup,dev,test,lint,ci}
└── doc/
    ├── agent/                          # sharepage 流用の詳細運用ドキュメント
    │   ├── styles.md                   # SCSS + BEM + 1 View = 1 Block 運用詳細
    │   ├── spec.md, models.md, controllers.md, views.md 等
    └── example_domain/                 # お手本ドメイン（未着手）
```

## デザイン原則参照順序

1. **[DESIGN.md](DESIGN.md)** — Single source of truth（[google-labs-code/design.md](https://github.com/google-labs-code/design.md) 準拠 YAML トークン + 根拠 prose）。UI 実装前に必読。
2. **[.claude/rules/design/principles.md](.claude/rules/design/principles.md)** — 普遍原則（4原則 + SaaSクリシェ回避）
3. **[.claude/rules/design/ui-ux.md](.claude/rules/design/ui-ux.md)** — プロジェクト固有の詳細（Density Ladder / プロダクト品質チェックリスト）
4. **[doc/agent/styles.md](doc/agent/styles.md)** — SCSS運用詳細

**UI 変更時のチェック**:
- 新しい色・サイズが必要 → `DESIGN.md` の YAML frontmatter にトークン追加 → `_variables.scss` に反映
- 既存トークンで代用可能 → 追加せずトークン参照のみ
- `DESIGN.md` を変更したら `npx @google/design.md lint DESIGN.md` で構造検証（WCAG / 参照切れチェック）

## 禁止事項

### 技術選定
- `app/services/` の乱立（ビジネスロジックはモデル / Form Object / **Agent** に配置）
- AI関連ロジックを `app/services/` に置く（**`app/agents/` 配下に ActiveAgent で実装**する）
- プロンプトを Ruby コードにベタ書き（ERB テンプレートを使う）
- API key を `config/active_agent.yml` に平文（credentials 経由）
- Rails 標準 `enum` の使用（Enumerize を使う）
- controller spec / view spec / routing spec（system spec と model spec のみ）
- Bootstrap / Tailwind 等の CSS フレームワーク併用
- Sass インデント記法

### SCSS
- BEM `--modifier`（`data-variant` で Variant、`.is-*` 1段で State）
- 1ファイル複数 Block
- 子孫セレクタ / 親参照ネスト
- `.is-*` をバリエーションに使う（`.is-lg` `.is-center`）
- `js-*` プリフィックスにスタイルを当てる
- ID セレクタをスタイル用途に
- コンポーネント内マージン（外部制御）
- HEX / px 直書き（トークン経由）

### 日本語タイポ・a11y
- `word-break: break-all` を全体適用
- `palt` を本文全体適用
- 和文 fallback 未指定
- `prefers-reduced-motion` 対応なし
- 320–375px で横スクロール発生

### デザイン
- 4原則違反
- Primary ボタン複数
- カードグリッド / グラデーション / 絵文字アイコン
- ヒーロー+3カードのランディング
- 独立ログアウトボタン
- 中途半端な max-width
- 破壊的操作を赤ボタンで主張

### CI・プロセス
- **CI緑を確認せずにマージ**
- CI が赤のままマージ
- ローカル `bin/ci` を通さず PR 作成
- main への直接コミット / force push
- UI変更で `design:*` を通さずマージ

## 開発サイクル

UI変更の有無で2サイクル使い分け。**どちらも最後に CI 緑を確認してからレビュー依頼・マージ**。

### 拡張サイクル — UI変更を**含む**

```
0. /plan
0.5. design:user-research / research-synthesis（要件浅い時のみ）
1. design:ux-copy                  → コピー先に確定
2. design:design-critique          → 4原則 + SaaSクリシェ
3. design:design-system            → 新UIパターン追加時
4. backend / frontend 並列実装
5. design:accessibility-review     → PR前 a11y
6. /test → /build-fix → /code-review
7. /verify                         → ブラウザ確認
8. security-reviewer               → 認証系・コミット前
9. bin/ci                          → ローカルで CI と同等を実行
10. コミット → gh pr create
11. GitHub Actions CI 緑を確認
12. レビュー依頼 → マージ
```

### 軽量サイクル — UI変更を**含まない**

```
1. /plan（複雑時のみ）
2. backend / frontend 実装
3. /test → /build-fix → /code-review
4. security-reviewer（認証系のみ）
5. bin/ci
6. コミット → gh pr create
7. CI 緑を確認 → マージ
```

## Claude エージェント / コマンド

### Agents（`.claude/agents/`）

| エージェント | 役割 |
|---|---|
| `planner` | 実装計画策定 |
| `backend` | モデル・コントローラー・マイグレーション・form/policy |
| `frontend` | view・component・stimulus・scss |
| `reviewer` | コードレビュー（変更後必須） |
| `security-reviewer` | セキュリティ分析 |

### Design Skills

UI変更・要件策定時は以下を織り込む:

- `design:user-research` / `design:research-synthesis`
- `design:ux-copy`（コピー先行）
- `design:design-critique`
- `design:design-system`
- `design:design-handoff`
- `design:accessibility-review`（PR前必須）

## 外部契約・参考実装

| 参照 | 用途 | 反映先 |
|---|---|---|
| [jp-ui-contracts](https://github.com/hirokaji/jp-ui-contracts) @ `5700b944` | 日本語UI契約 | `.claude/rules/styles.md` 冒頭コメント |
| [sharepage](https://github.com/SonicGarden/sharepage) | SCSS/BEM 運用・UI/UXルール参照実装 | `doc/agent/`、`.claude/rules/design/ui-ux.md` |
| [agent-resources](https://github.com/SonicGarden/agent-resources) | SG共通Claudeルール | `.claude/rules/{languages,frameworks,integrations}` |

四半期〜半年に1度、これらの差分を確認して取り込み判断すること。

## CI ワークフロー

`.github/workflows/ci.yml` で4ジョブ並列実行:

| ジョブ | 内容 |
|---|---|
| `scan_ruby` | brakeman + bundler-audit |
| `lint_ruby` | rubocop (sgcop) + erb_lint |
| `test` | RSpec + PostgreSQL service |
| `frontend` | eslint + stylelint + tsc |

`bin/ci` でローカルで CI と同等の処理を実行できる。

## 参考

- [SG共通ルール (agent-resources)](https://github.com/SonicGarden/agent-resources/tree/main/claude/rules)
- [sharepage 実装参照](https://github.com/SonicGarden/sharepage)
- [jp-ui-contracts](https://github.com/hirokaji/jp-ui-contracts)
- 元指示書: SharePage 経由で取得（`share_token: yT1NAjnNWFUCydhJqjMNpQ`）
