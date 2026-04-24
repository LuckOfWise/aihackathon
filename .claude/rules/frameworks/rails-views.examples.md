# Rails Views Rules - Examples

## Principles Examples

### ビジネスロジックは原則モデルに書く

**Good:**
```ruby
# モデルにロジックを配置
class Entry < ApplicationRecord
  def visible_comments_for(user)
    comments.select { |c| c.visible_to?(user) }
  end
end
```

```haml
-# ビューはシンプルに保つ
- if entry.visible_comments_for(current_user).any?
  = render partial: 'comment_list'
```
**Bad:**
```haml
-# ビューにビジネスロジックを書く
- if entry.user.present? && entry.user.active? && entry.group.opened?
  - if entry.comments.select { |c| c.visible_to?(current_user) }.any?
    = render partial: 'comment_list'
```

### margin外部制御
**Good:**
```haml
-# 親要素でレイアウト制御
.d-flex.flex-column.gap-3
  = render 'child_a'
  = render 'child_b'
```
**Bad:**
```haml
-# パーシャル内にmarginを持たせる
.mb-4
  = render 'child_a'
.mb-4
  = render 'child_b'
```

### Strict Locals宣言
**Good:**
```haml
-# app/views/application/_fields.html.haml
-# locals: (form:, options: nil)

.container
  = form.fields_for :items do |ff|
```

### locals経由のデータ渡し
**Good:**
```haml
= render 'global/ticket_orders/detail', ticket_order: @ticket_order
```
**Bad:**
```haml
-# パーシャル内でインスタンス変数を直接参照（依存関係が不明瞭）
= render 'global/ticket_orders/detail'
```

### I18n.l日時フォーマット
**Good:**
```ruby
l(updated_at, format: :minutes)
I18n.l(user.last_access_at, format: :hyphen)
```
**Bad:**
```ruby
updated_at.strftime('%Y/%m/%d %H:%M')
```

### コンポーネントのマージン禁止
**Good:**
```erb
<%# コンポーネント側: マージンなし %>
<div class="bg-base-100 p-4"><%= content %></div>

<%# 呼び出し側: レイアウト制御 %>
<div class="mb-4"><%= render SomeComponent.new %></div>
```
**Bad:**
```erb
<%# コンポーネント内でマージンを定義 %>
<div class="bg-base-100 p-4 mb-4"><%= content %></div>
```
