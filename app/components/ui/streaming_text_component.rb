class Ui::StreamingTextComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'streaming-text', 'aria-live': 'polite')
  end
end
