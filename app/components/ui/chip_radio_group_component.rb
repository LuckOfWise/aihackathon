class Ui::ChipRadioGroupComponent < ApplicationComponent
  def initialize(name:, options:, selected: nil)
    @name = name
    @options = options
    @selected = selected
  end

  def call
    content_tag(:div, class: 'chip-radio-group', role: 'radiogroup') do
      safe_join(@options.map { |label, value| chip(label, value || label) })
    end
  end

  private

  def chip(label, value)
    id = "chip-#{@name}-#{value.to_s.parameterize}"
    input = tag.input(type: :radio, name: @name, value: value, id: id,
                      checked: (value.to_s == @selected.to_s),
                      class: 'chip-radio-group__input')
    chip = content_tag(:label, label, for: id, class: 'chip-radio-group__chip')
    safe_join([input, chip])
  end
end
