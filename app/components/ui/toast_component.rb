class Ui::ToastComponent < ApplicationComponent
  def initialize(variant: :default)
    @variant = variant.to_sym
  end

  def call
    content_tag(:div, content, class: 'toast', data: { variant: @variant }, role: 'status')
  end
end
