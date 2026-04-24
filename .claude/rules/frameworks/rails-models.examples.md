# Rails Models Rules - Examples

## Principles Examples

### Concern分離
**Good:**
```ruby
# app/models/concerns/searchable.rb
module Searchable
  extend ActiveSupport::Concern

  included do
    scope :search, ->(query) { where('name LIKE ?', "%#{query}%") }
  end
end
```

### Enumerize使用
**Good:**
```ruby
class User < ApplicationRecord
  extend Enumerize
  enumerize :role, in: %i[admin member guest], predicates: { prefix: true }, scope: true
end
```
**Bad:**
```ruby
class User < ApplicationRecord
  enum role: { admin: 0, member: 1, guest: 2 }
end
```

### default_orderスコープ
**Good:**
```ruby
class Article < ApplicationRecord
  scope :default_order, -> { order(created_at: :desc, id: :desc) }
end
```
