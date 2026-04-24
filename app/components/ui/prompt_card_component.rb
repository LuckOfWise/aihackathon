class Ui::PromptCardComponent < ApplicationComponent
  def initialize(title:, body:, meta: nil)
    @title = title
    @body = body
    @meta = meta
  end

  def call
    content_tag(:article, class: 'prompt-card') do
      concat(content_tag(:h4, class: 'prompt-card__title') do
        concat(render(Ui::IconComponent.new(name: 'sparkles', size: 14)))
        concat(@title)
      end)
      concat(content_tag(:div, @body, class: 'prompt-card__body'))
      concat(content_tag(:div, @meta, class: 'prompt-card__meta')) if @meta
    end
  end
end
