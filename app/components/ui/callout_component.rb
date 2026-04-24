class Ui::CalloutComponent < ApplicationComponent
  def initialize(title: nil, variant: :default)
    @title = title
    @variant = variant.to_sym
  end

  def call
    content_tag(:aside, class: 'callout', data: { variant: @variant }) do
      content_tag(:div, class: 'callout__body') do
        concat(content_tag(:h4, @title, class: 'callout__title')) if @title.present?
        concat(content)
      end
    end
  end
end
