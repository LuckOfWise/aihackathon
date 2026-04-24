class Ui::AnchorComponent < ApplicationComponent
  def initialize(href:, variant: :default)
    @href = href
    @variant = variant.to_sym
  end

  def call
    link_to content, @href, class: 'anchor', data: { variant: @variant }
  end
end
