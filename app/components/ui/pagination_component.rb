class Ui::PaginationComponent < ApplicationComponent
  def initialize(total_pages:, current_page: 1, path_for: nil)
    @total_pages = total_pages
    @current_page = current_page
    @path_for = path_for || ->(page) { "?page=#{page}" }
  end

  def call
    content_tag(:nav, class: 'pagination', 'aria-label': 'pagination') do
      safe_join(pages.map { |p| render_item(p) })
    end
  end

  private

  def pages
    list = []
    list << :prev
    range = (1..@total_pages).to_a
    range.each { |i| list << i }
    list << :next
    list
  end

  def render_item(page)
    case page
    when :prev
      disabled = @current_page <= 1
      content_tag(:a, href: (disabled ? '#' : @path_for.call(@current_page - 1)),
                  class: 'pagination__item', 'aria-disabled': disabled) do
        render(Ui::IconComponent.new(name: 'chevron-left', size: 14))
      end
    when :next
      disabled = @current_page >= @total_pages
      content_tag(:a, href: (disabled ? '#' : @path_for.call(@current_page + 1)),
                  class: 'pagination__item', 'aria-disabled': disabled) do
        render(Ui::IconComponent.new(name: 'chevron-right', size: 14))
      end
    else
      content_tag(:a, page, href: @path_for.call(page),
                  class: ['pagination__item', ('is-active' if page == @current_page)].compact.join(' '))
    end
  end
end
