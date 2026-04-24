# Rails-Devise Rules - Examples

## Principles Examples

### 複数Deviseリソース
**Good:**
```ruby
# config/routes.rb - ユーザータイプごとに独立したDeviseリソース
devise_for :users, controllers: { sessions: 'users/devise/sessions' }
devise_for :admins, controllers: { sessions: 'admins/devise/sessions' }
devise_for :corporation_staffs, controllers: { sessions: 'corporation_staffs/devise/sessions' }
```
**Bad:**
```ruby
# 単一スコープで全ユーザー型を処理
devise_for :users
```

### 非同期通知送信
**Good:**
```ruby
class User < ApplicationRecord
  def send_devise_notification(notification, *)
    devise_mailer.send(notification, self, *).deliver_later
  end
end
```

### skip + 独自認証
**Good:**
```ruby
class Admins::ApplicationController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :authenticate_admin!
end
```
