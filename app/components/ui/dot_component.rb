class Ui::DotComponent < ApplicationComponent
  def initialize(variant: :default, size: :md, pulse: false)
    @variant = variant.to_sym
    @size = size.to_sym
    @pulse = pulse
  end

  def call
    content_tag(:span, '', class: ['dot', ('is-pulse' if @pulse)].compact.join(' '), data: { variant: @variant, size: @size }, 'aria-hidden': 'true')
  end
end
