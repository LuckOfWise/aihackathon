---
paths:
  - "app/routes/**/*.tsx"
  - "app/**/*.tsx"
  - "app/**/*.ts"
---
# React Router Rules

## Principles

- File-based routing (ファイル名がURLパスに対応, dot separatorsでセグメント区切り)
- Thin route files (routeファイルはページコンポーネントを呼ぶだけ, ロジックはcomponents/pagesに委譲)
- Layout grouping with underscore prefix (`_auth.tsx`でURL segmentなしのレイアウトグループ)
- Component directory separation (pages/, forms/, elements/, layouts/で責務分離)

## Examples

When in doubt: ./react-router.examples.md
