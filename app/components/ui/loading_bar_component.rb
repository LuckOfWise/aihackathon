class Ui::LoadingBarComponent < ApplicationComponent
  def call
    content_tag(:div, class: 'loading-bar', role: 'status') do
      content_tag(:span, '', class: 'loading-bar__fill')
    end
  end
end
