class Ui::RadioInputComponent < ApplicationComponent
  def initialize(name:, value:, label:, checked: false)
    @name = name
    @value = value
    @label = label
    @checked = checked
  end

  def call
    content_tag(:label, class: 'radio') do
      concat(tag.input(type: :radio, name: @name, value: @value,
                       checked: @checked, class: 'radio__input'))
      concat(@label)
    end
  end
end
