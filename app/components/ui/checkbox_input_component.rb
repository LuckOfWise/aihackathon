class Ui::CheckboxInputComponent < ApplicationComponent
  def initialize(name:, value: '1', label:, checked: false, disabled: false)
    @name = name
    @value = value
    @label = label
    @checked = checked
    @disabled = disabled
  end

  def call
    content_tag(:label, class: 'checkbox') do
      concat(tag.input(type: :checkbox, name: @name, value: @value,
                       checked: @checked, disabled: @disabled, class: 'checkbox__input'))
      concat(@label)
    end
  end
end
