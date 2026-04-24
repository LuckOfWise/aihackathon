class Ui::NavListComponent < ApplicationComponent
  def initialize(items:, current: nil)
    @items = items
    @current = current
  end

  def call
    content_tag(:nav) do
      content_tag(:ul, class: 'nav-list') do
        safe_join(@items.map do |item|
          active = item[:id].to_s == @current.to_s
          content_tag(:li, class: ['nav-list__item', ('is-active' if active)].compact.join(' ')) do
            link_to(item[:label], item[:href] || '#', class: 'nav-list__item-link')
          end
        end)
      end
    end
  end
end
