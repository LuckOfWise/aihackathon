class Ui::FieldsetComponent < ApplicationComponent
  def initialize(legend:)
    @legend = legend
  end

  def call
    content_tag(:fieldset, class: 'fieldset') do
      concat(content_tag(:legend, @legend, class: 'fieldset__legend'))
      concat(content)
    end
  end
end
