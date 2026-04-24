class Ui::BreadcrumbComponent < ApplicationComponent
  def initialize(items:)
    @items = items
  end

  def call
    content_tag(:nav, 'aria-label': 'パンくず') do
      content_tag(:ol, class: 'breadcrumb') do
        safe_join(@items.each_with_index.map { |item, i| render_item(item, i) })
      end
    end
  end

  private

  def render_item(item, idx)
    content_tag(:li, class: 'breadcrumb__item') do
      separator = idx.zero? ? '' : content_tag(:span, '/', class: 'breadcrumb__separator', 'aria-hidden': 'true')
      label = item[:href] ? link_to(item[:label], item[:href]) : content_tag(:span, item[:label])
      safe_join([separator, label])
    end
  end
end
