# Rails Rules - Examples

## Principles Examples

### Form Objectパターン
**Good:**
```ruby
# app/forms/registration_form.rb
class RegistrationForm
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :name, :string
  attribute :email, :string

  validates :name, :email, presence: true

  def save
    return false unless valid?
    User.create!(name: name, email: email)
  end
end
```
**Bad:**
```ruby
# コントローラーに複雑なフォームロジックを記述
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if params[:with_profile]
      @profile = Profile.new(profile_params)
      # ... 複雑な条件分岐
    end
  end
end
```

### 名前空間分離
**Good:**
```ruby
# 名前空間でユーザータイプを分離
# app/controllers/admins/application_controller.rb
module Admins
  class ApplicationController < ::ApplicationController
  end
end
```

### サービスクラス不使用
**Good:**
```ruby
# モデルにビジネスロジックを配置
class Order < ApplicationRecord
  def confirm!
    update!(status: :confirmed, confirmed_at: Time.current)
  end
end
```
**Bad:**
```ruby
# app/services/order_confirmation_service.rb
class OrderConfirmationService
  def call(order)
    order.update!(status: :confirmed)
  end
end
```
