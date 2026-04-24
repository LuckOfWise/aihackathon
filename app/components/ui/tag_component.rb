class Ui::TagComponent < ApplicationComponent
  def call
    content_tag(:span, content, class: 'tag')
  end
end
