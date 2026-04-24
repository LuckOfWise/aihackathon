class Ui::ReasoningComponent < ApplicationComponent
  def initialize(summary: '推論過程を表示', open: false)
    @summary = summary
    @open = open
  end

  def call
    content_tag(:details, class: 'reasoning', open: @open) do
      concat(content_tag(:summary, class: 'reasoning__summary') do
        concat(render(Ui::IconComponent.new(name: 'sparkles', size: 12)))
        concat(@summary)
      end)
      concat(content_tag(:div, content, class: 'reasoning__body'))
    end
  end
end
