class Ui::PillComponent < ApplicationComponent
  def initialize(variant: :default)
    @variant = variant.to_sym
  end

  def call
    content_tag(:span, content, class: 'pill', data: { variant: @variant })
  end
end
