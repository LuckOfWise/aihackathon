class Ui::PageComponent < ApplicationComponent
  WIDTHS = %i[focus form reading wide full].freeze

  renders_one :actions
  renders_one :lede
  renders_one :back_to

  def initialize(title:, width: :full)
    @title = title
    @width = width.to_sym
  end

  attr_reader :title, :width

  def width_attr
    width == :full ? nil : width
  end
end
