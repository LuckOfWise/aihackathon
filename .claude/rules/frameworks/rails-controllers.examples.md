# Rails Controllers Rules - Examples

## Principles Examples

### 名前空間別基底コントローラー継承
**Good:**
```ruby
# app/controllers/admins/application_controller.rb
module Admins
  class ApplicationController < ::ApplicationController
    skip_before_action :authenticate_user!
    before_action :authenticate_admin!
  end
end

# app/controllers/admins/users_controller.rb
module Admins
  class UsersController < ApplicationController
    # Admins::ApplicationControllerを継承
  end
end
```
**Bad:**
```ruby
# ::ApplicationControllerを直接継承して条件分岐
class Admin::UsersController < ApplicationController
  before_action :check_admin  # 条件分岐で認証
end
```

### RESTful設計
**Good:**
```ruby
# 標準7アクションで設計
resources :articles, only: %i[index show new create edit update destroy]
```
**Bad:**
```ruby
# カスタムアクションの乱用
resources :articles do
  member do
    post :publish
    post :unpublish
    post :archive
  end
end
```

### skip_before_action許可リスト
**Good:**
```ruby
skip_before_action :authenticate_user!, only: %i[show index]
```
**Bad:**
```ruby
skip_before_action :authenticate_user!, except: %i[create update destroy]
```

### 名前空間別ApplicationController継承
```ruby
# 典型的な名前空間分離パターン
module Users
  class ApplicationController < ::ApplicationController
    skip_before_action :authenticate_user!
    before_action :authenticate_end_user!

    private

    def authenticate_end_user!
      redirect_to new_user_session_path unless current_user&.end_user?
    end
  end
end

module Api
  class ApplicationController < ::ApplicationController
    skip_before_action :verify_authenticity_token
    skip_before_action :authenticate_user!
    before_action :authenticate_api_token!
  end
end
```
