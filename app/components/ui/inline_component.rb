class Ui::InlineComponent < ApplicationComponent
  def initialize(gap: :sm, justify: nil)
    @gap = gap.to_sym
    @justify = justify&.to_sym
  end

  def call
    content_tag(:div, content, class: 'inline', data: { gap: @gap, justify: @justify }.compact)
  end
end
