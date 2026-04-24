class Ui::SectionLabelComponent < ApplicationComponent
  def initialize(divider: false)
    @divider = divider
  end

  def call
    content_tag(:span, content, class: 'section-label', data: { divider: @divider })
  end
end
