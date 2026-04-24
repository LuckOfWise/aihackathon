class Ui::ProgressComponent < ApplicationComponent
  def initialize(value: nil, variant: :default)
    @value = value
    @variant = variant.to_sym
  end

  def call
    klass = 'progress'
    klass += ' is-indeterminate' if @value.nil?

    content_tag(:div, class: klass, data: { variant: @variant }, role: 'progressbar',
                'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': @value) do
      content_tag(:div, '', class: 'progress__fill', style: @value ? "width: #{@value}%" : nil)
    end
  end
end
