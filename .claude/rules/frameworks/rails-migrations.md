---
paths:
  - "db/migrate/**"
---
# Rails Migrations Rules

## Principles

- changeメソッド使用 (up/down禁止, reversible migration)
- NOT NULL推奨 (string/textカラムは`null: false, default: ''`で定義)
- decimal型推奨 (金額・税率カラムには`:decimal`型使用, `:float`禁止)
- カラムコメント (用途が名前から自明でないカラムには`comment:`を付与)
- インデックス設計 (外部キー・検索カラムにインデックス, 複合インデックスでサポートされている場合は無駄な単独インデックスを作らない)
- 既存データ更新はマイグレーションでは原則禁止
- データ移行分離 (スキーマ変更とデータ移行は別マイグレーションに分ける)
- remove_columnの制約 (原則モデル側でignored_columnsに指定されているカラムのみ削除可能)
- 動作確認 (`db:migrate`と`db:rollback`の両方を確認, ただしremove系の動作確認は人間が行う)
