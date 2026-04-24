class Ui::CircularProgressComponent < ApplicationComponent
  RADIUS = 20
  CIRCUMFERENCE = 2 * Math::PI * RADIUS

  def initialize(value: 0, label: nil)
    @value = value.clamp(0, 100)
    @label = label
  end

  def offset
    CIRCUMFERENCE - (CIRCUMFERENCE * @value / 100.0)
  end

  def call
    svg_content = <<~SVG.html_safe
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle class="circular-progress__track" cx="22" cy="22" r="#{RADIUS}"></circle>
        <circle class="circular-progress__fill" cx="22" cy="22" r="#{RADIUS}"
                stroke-dasharray="#{CIRCUMFERENCE.round(2)}"
                stroke-dashoffset="#{offset.round(2)}"></circle>
      </svg>
    SVG

    content_tag(:div, class: 'circular-progress', role: 'progressbar',
                'aria-valuenow': @value, 'aria-valuemin': 0, 'aria-valuemax': 100) do
      concat(svg_content)
      concat(content_tag(:span, @label || "#{@value}%", class: 'circular-progress__label'))
    end
  end
end
