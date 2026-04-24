---
paths:
  - "app/views/**"
---
# Rails Views Rules

## Principles

- ビジネスロジックは原則モデルに書く (ヘルパー等に記述するロジックはViewを構築する上で必要なロジックに留める)
- margin外部制御 (パーシャル内にmargin記述しない, 親要素で余白制御)
- 単一ルート要素 (コンポーネント/パーシャルごとに単一ルート要素)
- locals経由のデータ渡し (パーシャルではインスタンス変数を参照せずlocalsでデータを渡す)
- Strict Locals宣言 (パーシャル先頭にlocals宣言をコメントで記述)
- I18n.l日時フォーマット (strftimeではなくI18n.l()を使用)
- SimpleFormフォーム構築 (simple_form_for使用)

## Examples

When in doubt: ./rails-views.examples.md
