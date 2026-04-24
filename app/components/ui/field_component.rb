class Ui::FieldComponent < ApplicationComponent
  renders_one :hint
  renders_one :error

  def initialize(label:, name:, type: :text, value: nil, required: false, placeholder: nil, rows: nil)
    @label = label
    @name = name
    @type = type.to_sym
    @value = value
    @required = required
    @placeholder = placeholder
    @rows = rows
  end

  attr_reader :label, :name, :type, :value, :required, :placeholder, :rows

  def textarea?
    type == :textarea
  end

  def input_id
    @input_id ||= "field-#{name.to_s.parameterize}"
  end
end
