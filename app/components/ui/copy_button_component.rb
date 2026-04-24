class Ui::CopyButtonComponent < ApplicationComponent
  def initialize(text:, label: 'コピー')
    @text = text
    @label = label
  end

  def call
    content_tag(:button, type: 'button', class: 'copy-button', data: { controller: 'copy', 'copy-text-value': @text, action: 'copy#write' }) do
      concat(render(Ui::IconComponent.new(name: 'file', size: 12)))
      concat(@label)
    end
  end
end
