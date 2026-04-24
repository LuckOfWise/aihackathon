class Ui::ButtonComponent < ApplicationComponent
  VARIANTS = %i[primary outline ghost danger].freeze

  def initialize(variant: :primary, loading: false, disabled: false, type: 'button')
    @variant = variant.to_sym
    @loading = loading
    @disabled = disabled
    @type = type
  end

  attr_reader :variant, :loading, :disabled, :type

  def css_class
    ['button', ('is-loading' if loading)].compact.join(' ')
  end
end
