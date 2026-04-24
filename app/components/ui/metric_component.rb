class Ui::MetricComponent < ApplicationComponent
  def initialize(label:, value:, unit: nil)
    @label = label
    @value = value
    @unit = unit
  end

  def call
    content_tag(:div, class: 'metric') do
      concat(content_tag(:span, @label, class: 'metric__label'))
      concat(content_tag(:span, class: 'metric__value') do
        concat(content_tag(:span, @value, class: 'metric__number'))
        concat(content_tag(:span, @unit, class: 'metric__unit')) if @unit
      end)
    end
  end
end
