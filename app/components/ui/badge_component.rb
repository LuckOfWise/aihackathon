class Ui::BadgeComponent < ApplicationComponent
  VARIANTS = %i[default primary success warning danger].freeze

  def initialize(variant: :default, with_dot: false)
    @variant = variant.to_sym
    @with_dot = with_dot
  end

  attr_reader :variant, :with_dot
end
