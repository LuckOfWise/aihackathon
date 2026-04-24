---
paths:
  - "app/**/*.rb"
---
# Rails Stripe Integration Rules

## Principles

- カード情報非保持 (PCI DSS準拠。カード番号・CVV・有効期限をサーバーに保存しない)
- トークン化必須 (カード情報の代わりにトークンをDB保存)
- 公式SDK使用 (独自の決済API実装を避け、Stripe公式gemを使用)
- 機密情報ログ除外 (`filter_parameters`でカード関連情報をログから除外)
- Webhook悲観的ロック (`with_lock`でレースコンディション防止)
- 金額バリデーション (負の値や異常に大きな値を拒否)
