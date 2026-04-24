---
paths:
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.jsx"
---
# JavaScript Rules

## Principles

- メモリ管理 (disconnect()でlistener除去, bound refs保存, timer clear)
- デバウンスパターン (clearTimeout before setTimeout, null reset after execution)
- バッチDOM操作 (DocumentFragment for multiple insertions)
