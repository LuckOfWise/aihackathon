class Ui::ChatInputComponent < ApplicationComponent
  def initialize(name: :message, value: nil, placeholder: 'メッセージを入力', action: nil, method: :post)
    @name = name
    @value = value
    @placeholder = placeholder
    @action = action
    @method = method
  end

  attr_reader :name, :value, :placeholder, :action, :method
end
