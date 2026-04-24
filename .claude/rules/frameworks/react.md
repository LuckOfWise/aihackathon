---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
---
# React Rules

## Principles

- 関数コンポーネント (class不使用)
- コロケーション (_components, _tests等のアンダースコアディレクトリ)
- Hooks優先 (useCallback, useMemo, カスタムフック)
- コンポジション (hooks合成, Context+Provider)
- 単一責任 (コンポーネントは1つの関心事に集中)

## Examples

When in doubt: ./react.examples.md
