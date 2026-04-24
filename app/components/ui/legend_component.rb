class Ui::LegendComponent < ApplicationComponent
  def initialize(items:)
    @items = items
  end

  def call
    content_tag(:div, class: 'legend') do
      @items.map do |item|
        content_tag(:span, class: 'legend__item') do
          concat(render(Ui::DotComponent.new(variant: item[:variant] || :default)))
          concat(item[:label])
        end
      end.reduce(:+)
    end
  end
end
