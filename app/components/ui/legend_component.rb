class Ui::LegendComponent < ApplicationComponent
  def initialize(items:)
    @items = items
  end

  def call
    content_tag(:div, class: 'legend') do
      @items.sum do |item|
        content_tag(:span, class: 'legend__item') do
          concat(render(Ui::DotComponent.new(variant: item.fetch(:variant, :default))))
          concat(item[:label])
        end
      end
    end
  end
end
