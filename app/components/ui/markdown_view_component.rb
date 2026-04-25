class Ui::MarkdownViewComponent < ApplicationComponent
  def initialize(text:)
    @text = text
  end

  def call
    content_tag(:div, simple_format(sanitize(@text)), class: 'markdown-view') # rubocop:disable Sgcop/SimpleFormat
  end
end
