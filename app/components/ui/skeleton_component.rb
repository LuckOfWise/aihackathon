class Ui::SkeletonComponent < ApplicationComponent
  SHAPES = %i[line title circle block].freeze

  def initialize(shape: :line)
    @shape = shape.to_sym
  end

  def call
    content_tag(:span, '', class: 'skeleton', data: { shape: @shape }, 'aria-hidden': 'true')
  end
end
