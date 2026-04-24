---
paths:
  - "app/policies/**"
  - "app/controllers/**"
---
# Rails-Pundit Rules

## Principles

- デフォルト拒否 (ApplicationPolicyで全アクションfalse、明示的に許可が必要)
- 認可の強制検証 (after_action :verify_authorized、Deviseコントローラー以外で必須)
- 名前空間スコーピング (名前空間ごとにpolicy_scope/authorizeをオーバーライドしてプレフィックス付与)
- pundit_userオーバーライド (各名前空間で認証リソースに合わせてpundit_userを返す)
- Scopeベースのレコードフィルタリング (`Scope#resolve`でユーザー型に応じたデータスコープ制御)

## Examples

When in doubt: ./rails-pundit.examples.md
