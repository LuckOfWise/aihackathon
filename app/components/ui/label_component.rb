class Ui::LabelComponent < ApplicationComponent
  def initialize(for_input: nil, required: false)
    @for_input = for_input
    @required = required
  end

  def call
    content_tag(:label, class: 'label', for: @for_input) do
      concat(content)
      concat(content_tag(:span, '*', class: 'label__required', 'aria-hidden': 'true')) if @required
    end
  end
end
