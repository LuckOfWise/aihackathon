---
paths:
  - "tests/e2e/**"
  - "playwright.config.ts"
---
# Playwright E2E Testing Rules

## Principles

- Page Object Model (テストとページ操作の分離, BasePage抽象クラス)
- セマンティックセレクタ (getByRole, getByLabel, getByText優先, CSSセレクタ回避)
- 適切な待機 (expect().toBeVisible()で暗黙的待機)
- エミュレータ統合 (テストデータはEmulatorに作成、afterEachでクリア)
- 関心の分離 (ヘルパー: `_models/`, `_utils/`, Page Object: `_pages/`)

## Examples

When in doubt: ./playwright.examples.md
