class Ui::InlineMessageComponent < ApplicationComponent
  def initialize(variant: :default)
    @variant = variant.to_sym
  end

  def call
    content_tag(:span, content, class: 'inline-message', data: { variant: @variant })
  end
end
