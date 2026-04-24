class Ui::KbdComponent < ApplicationComponent
  def call
    content_tag(:kbd, content, class: 'kbd')
  end
end
