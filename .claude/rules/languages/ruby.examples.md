# Ruby Rules - Examples

## Principles Examples

### sgcop準拠
**Good:**
```ruby
# trailing comma必須 (multiline)
def method(
  arg1,
  arg2,
)
end

# self.xxxクラスメソッド定義
class MyModel
  def self.find_by_name(name)
    where(name: name)
  end
end
```
**Bad:**
```ruby
# trailing commaなし
def method(
  arg1,
  arg2
)
end
```

### イミュータビリティ優先
**Good:**
```ruby
STATUSES = %i[active inactive archived].freeze

users.map(&:name)
users.select { |u| u.active? }.map(&:email)
```
**Bad:**
```ruby
STATUSES = [:active, :inactive, :archived]

names = []
users.each { |u| names << u.name }
```

### ガード節によるネスト回避
**Good:**
```ruby
def process(record)
  return unless record.present?
  return unless record.valid?

  record.save!
end
```
**Bad:**
```ruby
def process(record)
  if record.present?
    if record.valid?
      record.save!
    end
  end
end
```

### Bangメソッド使用基準

**Good:**
```ruby
# 戻り値を見ないとき → Bangメソッドで失敗を検知
user.update!(name: 'New Name')

# 戻り値を見るとき → 非Bangメソッド
if user.update(name: 'New Name')
  redirect_to user_path(user)
else
  render :edit
end
```
**Bad:**
```ruby
# 戻り値を見ないのに非Bangメソッド → 失敗に気づけない
user.update(name: 'New Name')
redirect_to user_path(user)
```

### Enumerize定義パターン

```ruby
class User < ApplicationRecord
  extend Enumerize

  enumerize :role, in: %i[admin member guest], predicates: { prefix: true }, scope: true

  # 使用例:
  # user.role_admin?
  # User.with_role(:admin)
end
```
