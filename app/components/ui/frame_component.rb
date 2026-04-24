class Ui::FrameComponent < ApplicationComponent
  RATIOS = %w[1:1 16:9 4:3 3:2].freeze

  def initialize(ratio: '16:9')
    @ratio = ratio
  end

  def call
    content_tag(:div, content, class: 'frame', data: { ratio: @ratio })
  end
end
