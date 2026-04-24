---
paths:
  - "app/models/**"
---
# Rails Models Rules

## Principles

- バリデーション責務 (パラメータ検証・ビジネスルール実装はモデルの責務)
- Concern分離 (共有ロジックはapp/models/concerns/に抽出, 単一責任で小さく保つ)
- Enumerize使用 (Rails標準enumではなくenumerize gem, predicates/scope対応)
- 宣言的モデル構造 (enumerize → attr → associations → scopes → validations → callbacks → class methods → methods → private)
- default_orderスコープ (各モデルにdefault_orderを定義)
- preload優先 (eager_loadよりpreload, N+1防止)
- 状態遷移メソッド (confirm!, cancel!等の破壊的メソッドで定義)
- コンテキスト別バリデーション (with_options on: :context で段階的バリデーション)
- コールバック最小化 (暗黙の副作用を避け、明示的メソッド呼び出しを優先)

## Examples

When in doubt: ./rails-models.examples.md
