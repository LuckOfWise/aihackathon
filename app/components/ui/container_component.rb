class Ui::ContainerComponent < ApplicationComponent
  WIDTHS = %i[focus form reading wide].freeze

  def initialize(width: :wide)
    @width = width.to_sym
  end

  def call
    content_tag(:div, content, class: 'container', data: { width: @width })
  end
end
