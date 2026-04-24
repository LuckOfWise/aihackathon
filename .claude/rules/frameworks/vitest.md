---
paths:
  - "**/_tests/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "vitest*.config.*"
---
# Vitest Testing Rules

## Principles

- Co-location (テストは`_tests/`サブディレクトリ、モックは`_mocks/`に配置)
- Mock isolation (afterEachで`vi.clearAllMocks()` + `cleanup()`)
- 日本語テスト名 (describe/itのテスト内容を日本語で記述)
- Testing Library統合 (role, text, labelベースアサーション優先)
- ファクトリパターン (テストデータ生成にfactory.build()使用)
- 分離された環境 (クライアント: jsdom, サーバー: node)

## Examples

When in doubt: ./vitest.examples.md
