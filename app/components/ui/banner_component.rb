class Ui::BannerComponent < ApplicationComponent
  def initialize(variant: :default)
    @variant = variant.to_sym
  end

  def call
    content_tag(:div, content, class: 'banner', data: { variant: @variant })
  end
end
