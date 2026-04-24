# AIエージェント共通ガイドライン

このディレクトリには、Claude Code で共有する AI エージェント向けガイドラインを格納しています。

## ファイル構成

### ガイドラインファイル（AI エージェント共通）
- `general.md` - 一般的な開発ガイドライン（全ファイル対象）
- `code-review.md` - プロジェクト固有のコードレビューガイドライン
- `code-review-rails.md` - Rails 共通のコードレビューガイドライン
- `models.md` - モデルレイヤーガイドライン（app/models/**/* 対象）
- `views.md` - ビューレイヤーガイドライン（app/views/**/* 対象）
- `styles.md` - CSS スタイルガイドライン（app/assets/stylesheets/**/* 対象）
- `spec.md` - RSpec テストガイドライン（spec/**/* 対象）
- `routes.md` - ルーティングガイドライン（config/routes.rb 対象）
- `migrate.md` - マイグレーションガイドライン（db/migrate/**/* 対象）
- `controllers.md` - コントローラーガイドライン（app/controllers/**/* 対象）
- `capybara.md` - Capybara システムテストガイドライン

## 使用技術スタック

- **フレームワーク**: Ruby on Rails 8.1
- **データベース**: PostgreSQL
- **JS バンドラ**: esbuild (jsbundling-rails)
- **CSS**: SCSS + BEM（フレームワークなし）
- **JS フレームワーク**: Stimulus + Turbo（Hotwire）
- **テスト**: RSpec
- **Lint**: RuboCop (rubocop-rails-omakase)

## メンテナンス

### ガイドライン更新
ガイドラインの更新は、このディレクトリ内のファイルを直接編集してください。

### 新ディレクトリへのルール追加時のチェックポイント
- `.claude/rules/` 内に `paths:` フロントマターを持つルールファイルを作成
- 対応するガイドラインファイルが `doc/agent/` 内に存在するか確認
- 相対パスが正しく設定されているか確認
