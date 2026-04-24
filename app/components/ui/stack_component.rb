class Ui::StackComponent < ApplicationComponent
  def initialize(gap: :md, align: nil)
    @gap = gap.to_sym
    @align = align&.to_sym
  end

  def call
    content_tag(:div, content, class: 'stack', data: { gap: @gap, align: @align }.compact)
  end
end
