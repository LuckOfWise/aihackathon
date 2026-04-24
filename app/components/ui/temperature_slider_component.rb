class Ui::TemperatureSliderComponent < ApplicationComponent
  def initialize(name: :temperature, value: 0.7)
    @name = name
    @value = value
  end

  def call
    content_tag(:div, class: 'temperature-slider') do
      concat(content_tag(:div, class: 'temperature-slider__head') do
        concat(content_tag(:span, 'Temperature', class: 'temperature-slider__label'))
        concat(content_tag(:span, format('%.1f', @value), class: 'temperature-slider__value'))
      end)
      concat(tag.input(type: :range, name: @name, value: @value, min: 0, max: 2, step: 0.1, class: 'slider__input'))
      concat(content_tag(:div, class: 'temperature-slider__hint') do
        concat(content_tag(:span, '決定的'))
        concat(content_tag(:span, '創造的'))
      end)
    end
  end
end
