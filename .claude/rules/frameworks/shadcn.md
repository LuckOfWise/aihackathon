---
paths:
  - "src/components/**"
---
# Shadcn UI Rules

## Principles

- Shadcnコンポーネントファースト (カスタムUI作成前に既存コンポーネントを確認)
- Form + Zodパターン (Controller + zodResolver + Field + FieldError)
- Tailwind CSSでスタイリング (CSS Modulesは最小限に)
- CVAバリアント (class-variance-authorityでvariant/sizeプロパティ定義)
- コンポジション (基底コンポーネントをprops spreadingでラップ)

## Examples

When in doubt: ./shadcn.examples.md
