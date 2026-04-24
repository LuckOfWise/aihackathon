class Ui::SwitchComponent < ApplicationComponent
  def initialize(name:, label:, checked: false)
    @name = name
    @label = label
    @checked = checked
  end

  def call
    content_tag(:label, class: 'switch') do
      concat(tag.input(type: :checkbox, name: @name, checked: @checked, class: 'switch__input'))
      concat(@label)
    end
  end
end
