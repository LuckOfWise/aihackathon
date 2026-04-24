---
paths:
  - "app/**/*.tsx"
---
# Mantine UI Rules

## Principles

- Mantine コンポーネント優先 (カスタムUI作成前に既存コンポーネントを確認)
- Form + Zod パターン (バリデーションはzodスキーマで定義、zodResolverで統合)
- Zodエラーメッセージは日本語で設定
- コンポーネントスタイリング優先順位: Mantineプロパティ → Tailwindクラス → CSS Modules (stylesプロパティは使わない)
- Polymorphic button components (ConfirmButton/LoadingOverlayButton/ModalButton variants)

## Examples

When in doubt: ./mantine.examples.md
