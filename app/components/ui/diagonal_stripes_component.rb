class Ui::DiagonalStripesComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'diagonal-stripes', 'aria-hidden': 'true')
  end
end
