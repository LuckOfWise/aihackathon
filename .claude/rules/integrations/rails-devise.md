---
paths:
  - "app/controllers/**"
  - "app/models/**"
  - "config/initializers/devise*.rb"
  - "config/routes/**"
---
# Rails-Devise Rules

## Principles

- 複数Deviseリソース (ユーザータイプごとに独立した認証モデルを個別管理)
- 非同期通知送信 (`send_devise_notification`をオーバーライドして`deliver_later`で送信)
- 名前空間別セッション管理 (各モデルでカスタムコントローラーパスを指定)
- skip + 独自認証 (基底`authenticate_user!`をskipしてから名前空間固有の認証フィルタを設定)
- 論理削除との統合 (`active_for_authentication?`で`active?`を確認)

## Examples

When in doubt: ./rails-devise.examples.md
