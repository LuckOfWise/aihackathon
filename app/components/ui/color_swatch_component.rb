class Ui::ColorSwatchComponent < ApplicationComponent
  def initialize(color:, active: false, label: nil)
    @color = color
    @active = active
    @label = label || color
  end

  def call
    tag.button(
      type: :button,
      class: ['color-swatch', ('is-active' if @active)].compact.join(' '),
      style: "background: #{@color};",
      title: @label,
      'aria-label': @label,
    )
  end
end
