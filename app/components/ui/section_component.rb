class Ui::SectionComponent < ApplicationComponent
  def initialize(label: nil)
    @label = label
  end

  def call
    content_tag(:section, class: 'section') do
      concat(content_tag(:span, @label, class: 'section__label')) if @label.present?
      concat(content_tag(:div, content, class: 'section__body'))
    end
  end
end
