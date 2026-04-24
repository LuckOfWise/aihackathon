class Ui::BoxComponent < ApplicationComponent
  def initialize(padding: :md, bg: nil, bordered: false)
    @padding = padding.to_sym
    @bg = bg&.to_sym
    @bordered = bordered
  end

  def call
    content_tag(:div, content, class: 'box', data: { padding: @padding, bg: @bg, bordered: @bordered }.compact)
  end
end
