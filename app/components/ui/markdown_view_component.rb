class Ui::MarkdownViewComponent < ApplicationComponent
  def initialize(text:)
    @text = text
  end

  def call
    content_tag(:div, simple_format(@text), class: 'markdown-view')
  end
end
