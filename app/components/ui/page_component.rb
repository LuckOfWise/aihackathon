class Ui::PageComponent < ApplicationComponent
  WIDTHS = %i[focus form reading wide full].freeze

  renders_one :actions
  renders_one :lede

  def initialize(title:, width: :full, back_to: nil)
    @title = title
    @width = width.to_sym
    @back_to = back_to
  end

  attr_reader :title, :width, :back_to

  def width_attr
    width == :full ? nil : width
  end
end
