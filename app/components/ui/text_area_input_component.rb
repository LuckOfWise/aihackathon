class Ui::TextAreaInputComponent < ApplicationComponent
  def initialize(name:, value: nil, rows: 4, placeholder: nil, required: false)
    @name = name
    @value = value
    @rows = rows
    @placeholder = placeholder
    @required = required
  end

  def call
    content_tag(:textarea, @value.to_s, name: @name, rows: @rows, class: 'input',
                                        placeholder: @placeholder, required: @required)
  end
end
