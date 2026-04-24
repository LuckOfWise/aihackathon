class Ui::TextInputComponent < ApplicationComponent
  def initialize(name:, value: nil, type: :text, placeholder: nil, required: false, disabled: false, size: :md)
    @name = name
    @value = value
    @type = type
    @placeholder = placeholder
    @required = required
    @disabled = disabled
    @size = size.to_sym
  end

  def call
    tag.input(
      type: @type,
      name: @name,
      value: @value,
      class: 'input',
      placeholder: @placeholder,
      required: @required,
      disabled: @disabled,
      data: { size: @size },
    )
  end
end
