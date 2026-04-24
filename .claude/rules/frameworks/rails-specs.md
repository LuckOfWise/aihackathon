---
paths:
  - "spec/**"
---
# Rails Specs/Testing Rules

## Principles

- RSpec使用 (Minitest不使用)
- 日本語テスト記述 (describe/it/contextに日本語で記述)
- FactoryBot活用 (テストデータ生成にFactoryBot使用)
- システムスペックでCapybara (ブラウザテストにCapybara使用)
- 共有コンテキスト/共有Example (shared_context/shared_examplesで共通テストを抽出)

## Examples

When in doubt: ./rails-specs.examples.md
