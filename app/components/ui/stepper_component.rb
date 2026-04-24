class Ui::StepperComponent < ApplicationComponent
  def initialize(steps:, current: 1)
    @steps = steps
    @current = current
  end

  def call
    content_tag(:ol, class: 'stepper') do
      content = @steps.each_with_index.flat_map do |label, i|
        index = i + 1
        state =
          if index < @current then 'is-done'
          elsif index == @current then 'is-active'
          end
        step = content_tag(:li, class: ['stepper__step', state].compact.join(' ')) do
          concat(content_tag(:span, (index < @current ? '✓' : index), class: 'stepper__index'))
          concat(content_tag(:span, label, class: 'stepper__label'))
        end
        items = [step]
        items << content_tag(:li, '', class: 'stepper__connector', 'aria-hidden': 'true') if index < @steps.size
        items
      end
      safe_join(content)
    end
  end
end
