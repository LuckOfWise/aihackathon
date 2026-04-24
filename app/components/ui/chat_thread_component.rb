class Ui::ChatThreadComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'chat-thread')
  end
end
