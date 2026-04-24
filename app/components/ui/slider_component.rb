class Ui::SliderComponent < ApplicationComponent
  def initialize(name:, value: 0, min: 0, max: 100, step: 1, marks: nil)
    @name = name
    @value = value
    @min = min
    @max = max
    @step = step
    @marks = marks
  end

  def call
    content_tag(:div, class: 'slider') do
      concat(tag.input(type: :range, name: @name, value: @value,
                       min: @min, max: @max, step: @step, class: 'slider__input'))
      if @marks
        concat(content_tag(:div, class: 'slider__marks') do
          safe_join(@marks.map { |m| content_tag(:span, m) })
        end)
      end
    end
  end
end
