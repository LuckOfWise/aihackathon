class Ui::TabsComponent < ApplicationComponent
  def initialize(items:, active: nil)
    @items = items
    @active = active
  end

  def call
    content_tag(:nav, class: 'tabs', role: 'tablist') do
      safe_join(@items.map do |item|
        id = item.fetch(:id, item[:label])
        active = id.to_s == @active.to_s
        tag = item[:href] ? :a : :button
        content_tag(tag, item[:label], href: item[:href],
                                       class: ['tabs__item', ('is-active' if active)].compact.join(' '),
                                       role: 'tab', 'aria-selected': active)
      end)
    end
  end
end
