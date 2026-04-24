---
paths:
  - "app/**/*.rb"
  - "config/**/*.rb"
  - "db/**/*.rb"
  - "lib/**/*.rb"
  - "spec/**/*.rb"
---
# Rails Rules

## Principles

- Form Objectパターン (ActiveModel::Model継承で複雑なフォームをapp/forms/に分離)
- 名前空間分離 (ロール別にコントローラー・ビューを名前空間で分離)
- コントローラー薄さ / 単一責任 (ビジネスロジックはモデルに委譲)
- サービスクラス不使用 (app/services不使用, ビジネスロジックはモデル/FormObjectに配置)
- Concern分離 (共有ロジックをconcerns/に抽出)
- RESTful限定 (7つの標準アクションのみ)
- マルチテナントデータ分離 (SaferInitialize等でテナントスコープ保護)
- Enumerize優先 (Rails標準enumではなくenumerize gem)
- N+1対策 (preload優先, strict_loading)
- トランザクション使用 (複数レコード操作時)

## Examples

When in doubt: ./rails.examples.md
