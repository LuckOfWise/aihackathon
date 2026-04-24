class Ui::DividerComponent < ApplicationComponent
  def initialize(direction: :horizontal, variant: :default, label: nil)
    @direction = direction.to_sym
    @variant = variant.to_sym
    @label = label
  end

  def call
    if @label.present?
      content_tag(:div, @label, class: 'divider__with-label', role: 'separator')
    else
      content_tag(:hr, '', class: 'divider', data: { direction: @direction, variant: @variant })
    end
  end
end
