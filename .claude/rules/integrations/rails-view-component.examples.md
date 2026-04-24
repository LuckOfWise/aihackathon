# Rails-ViewComponent Rules - Examples

## Principles Examples

### BaseComponent継承
**Good:**
```ruby
class Events::CardComponent < BaseComponent
  def initialize(event:, is_mobile: false)
    @event = event
    @is_mobile = is_mobile
  end
end
```
**Bad:**
```ruby
# ViewComponent::Baseを直接継承するとヘルパーが使えない
class Events::CardComponent < ViewComponent::Base
end
```

### Slotsパターン
**Good:**
```ruby
class HeaderNavbarComponent < BaseComponent
  renders_one :logo_block
  renders_one :center_block
  renders_one :menu_block
end
```
```haml
= render HeaderNavbarComponent.new do |c|
  - c.with_logo_block do
    %img{ src: logo_path }
  - c.with_center_block do
    = yield
```

### render?ガード
**Good:**
```ruby
class CarouselComponent < BaseComponent
  def initialize(images:)
    @images = images
  end

  def render?
    @images.present?
  end
end
```
