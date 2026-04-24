# Rails-Pundit Rules - Examples

## Principles Examples

### 名前空間スコーピング
**Good:**
```ruby
class BizAdmins::ApplicationController < ApplicationController
  before_action :authenticate_business_admin!

  def policy_scope(scope)
    super([:business_admins, scope])
  end

  def authorize(record, query = nil)
    super([:business_admins, record], query)
  end

  def pundit_user
    current_business_admin
  end
end
```
**Bad:**
```ruby
# Punditデフォルトのまま - current_userが使われ名前空間ポリシーが適用されない
class BizAdmins::ApplicationController < ApplicationController
  # pundit_userをオーバーライドしていない
end
```

### Scope#resolveでcase/when分岐
**Good:**
```ruby
class ChildPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      case @user
      when User
        @user.accessible_children
      when Supervisor
        Child.where(id: @user.task_sets.pluck(:child_id))
      when Admin
        Child.all
      else
        scope.none
      end
    end
  end
end
```

### デフォルト拒否
**Good:**
```ruby
class ApplicationPolicy
  def index? = false
  def show? = false
  def create? = false
  def update? = false
  def destroy? = false
end
```
