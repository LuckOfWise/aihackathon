class Ui::ColorTokenComponent < ApplicationComponent
  def initialize(token:)
    @token = token
  end

  def call
    content_tag(:div, class: 'color-token') do
      concat(content_tag(:div, '', class: 'color-token__chip', style: "background: var(#{@token});"))
      concat(content_tag(:span, @token, class: 'color-token__name'))
    end
  end
end
