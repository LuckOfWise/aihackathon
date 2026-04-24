class Ui::CaptionComponent < ApplicationComponent
  def call
    content_tag(:p, content, class: 'caption')
  end
end
