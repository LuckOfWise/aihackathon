class Ui::DropdownItemComponent < ApplicationComponent
  def initialize(label:, icon: nil, shortcut: nil, variant: :default, href: nil)
    @label = label
    @icon = icon
    @shortcut = shortcut
    @variant = variant.to_sym
    @href = href
  end

  def call
    tag = @href ? :a : :button
    opts = {
      class: 'dropdown-item',
      data: { variant: @variant },
      type: (tag == :button ? 'button' : nil),
      href: @href,
    }.compact
    content_tag(tag, **opts) do
      concat(content_tag(:span, class: 'dropdown-item__icon') { render(Ui::IconComponent.new(name: @icon, size: 16)) }) if @icon
      concat(content_tag(:span, @label))
      concat(content_tag(:span, @shortcut, class: 'dropdown-item__shortcut')) if @shortcut
    end
  end
end
