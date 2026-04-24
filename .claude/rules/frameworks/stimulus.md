---
paths:
  - "app/javascript/controllers/**"
---
# Stimulus Rules

## Principles

- プログレッシブエンハンスメント (サーバーサイドHTMLを拡張する形)
- Turbo Stream連携 (部分更新にはTurbo Streamレスポンスを活用)
- disconnect()でクリーンアップ必須 (chart.destroy(), popover?.dispose()等)

## Examples

When in doubt: ./stimulus.examples.md
