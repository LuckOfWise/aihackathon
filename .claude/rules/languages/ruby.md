---
paths:
  - "**/*.rb"
  - "**/*.rake"
---
# Ruby Rules

## Principles

- sgcop準拠 (SonicGarden独自RuboCop設定, trailing comma必須, ClassStructure順序強制)
- Enumerize優先 (Rails enumではなくenumerize gem, predicates/scopes/i18n統合)
- イミュータビリティ優先 (frozen_string_literal, .freeze on constants, %i[] for symbol arrays)
- ガード節によるネスト回避 (早期リターン, `return unless`, 最大4レベル)
- 意味のある命名 (クラスは名詞, 副作用メソッドは動詞, `?`で述語, `!`で破壊的操作, full words)
- メソッドの単一責任 (20行以下が目安, 超過時はプライベートメソッドに分割)
- Bangメソッド使用基準 (戻り値を見ないときのみ`create!`, `update!`, `destroy!`等のBangメソッドを利用)
- DB側処理優先 (pluck > map, group/count > Ruby集計)
- nil処理 (論理的にありえないnil処理は書かない, 必要な場合のみ&. operator, ||= memoization, .presenceを使用)
- キーワード引数優先 (明示的なインターフェース)
- Enumerize定義パターン (`enumerize :field, in: %i[...], predicates: true, scope: true` - Rails標準enumの代替)

## Examples

When in doubt: ./ruby.examples.md
