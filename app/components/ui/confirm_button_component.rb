class Ui::ConfirmButtonComponent < ApplicationComponent
  def initialize(message: '実行してもよろしいですか？', method: :post, href: '#', variant: :danger)
    @message = message
    @method = method
    @href = href
    @variant = variant.to_sym
  end

  def call
    button_to content, @href, method: @method, class: 'button',
                              data: { variant: @variant, turbo_confirm: @message }
  end
end
