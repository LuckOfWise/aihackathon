class Ui::ButtonGroupComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'button-group', role: 'group')
  end
end
