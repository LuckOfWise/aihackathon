class Ui::QuoteComponent < ApplicationComponent
  def initialize(attribution: nil)
    @attribution = attribution
  end

  def call
    content_tag(:blockquote, class: 'quote') do
      concat(content)
      concat(content_tag(:cite, @attribution, class: 'quote__attribution')) if @attribution.present?
    end
  end
end
