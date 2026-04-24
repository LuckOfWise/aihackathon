class Ui::AccordionComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'accordion')
  end
end
