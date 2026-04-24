---
paths:
  - "src/app/**"
  - "src/layouts/**"
---
# Next.js App Router Rules

## Principles

- App Routerパターン (Pages Router機能は使用しない)
- 薄いページ (ロジックはcomponents/pages/に委譲)
- Server/Clientの境界 (page.tsxはServer Component、hooks使用時は'use client')
- ルートグループ活用 (レイアウト切り替えにRoute Groups使用)
- Suspenseファーストローディング (LoadingScreenフォールバック)

## Examples

When in doubt: ./nextjs.examples.md
