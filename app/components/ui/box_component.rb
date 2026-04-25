class Ui::BoxComponent < ApplicationComponent
  def initialize(padding: :md, background: nil, bordered: false)
    @padding = padding.to_sym
    @background = background&.to_sym
    @bordered = bordered
  end

  def call
    content_tag(:div, content, class: 'box', data: { padding: @padding, bg: @background, bordered: @bordered }.compact)
  end
end
