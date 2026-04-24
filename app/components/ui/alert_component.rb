class Ui::AlertComponent < ApplicationComponent
  VARIANTS = %i[notice alert success warning].freeze

  def initialize(variant: :notice)
    @variant = variant.to_sym
  end

  attr_reader :variant

  def render?
    content.present?
  end
end
