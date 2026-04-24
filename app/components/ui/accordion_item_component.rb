class Ui::AccordionItemComponent < ApplicationComponent
  def initialize(summary:, open: false)
    @summary = summary
    @open = open
  end

  def call
    content_tag(:details, class: 'accordion__item', open: @open) do
      concat(content_tag(:summary, @summary, class: 'accordion__summary'))
      concat(content_tag(:div, content, class: 'accordion__body'))
    end
  end
end
