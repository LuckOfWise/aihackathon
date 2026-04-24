class Ui::LoadingDotsComponent < ApplicationComponent
  def call
    content_tag(:span, class: 'loading-dots', 'aria-label': '処理中', role: 'status') do
      safe_join(3.times.map { content_tag(:span, '', class: 'loading-dots__dot') })
    end
  end
end
