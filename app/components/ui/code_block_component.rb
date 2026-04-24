class Ui::CodeBlockComponent < ApplicationComponent
  def initialize(language: nil)
    @language = language
  end

  def call
    content_tag(:pre, class: 'code-block', data: { language: @language }) do
      content_tag(:code, content)
    end
  end
end
