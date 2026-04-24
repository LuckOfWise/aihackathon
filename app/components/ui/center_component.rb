class Ui::CenterComponent < ApplicationComponent
  def initialize(direction: :row, min_height: nil)
    @direction = direction.to_sym
    @min_height = min_height
  end

  def call
    content_tag(:div, content, class: 'center', data: { direction: @direction, 'min-height': @min_height }.compact)
  end
end
