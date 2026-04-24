class Ui::ChipComponent < ApplicationComponent
  def initialize(active: false)
    @active = active
  end

  def call
    content_tag(:span, content, class: ['chip', ('is-active' if @active)].compact.join(' '))
  end
end
