class Ui::HeadingComponent < ApplicationComponent
  def initialize(level: 1)
    @level = level.to_i.clamp(1, 3)
  end

  def call
    content_tag("h#{@level}", content, class: 'heading', data: { level: @level })
  end
end
