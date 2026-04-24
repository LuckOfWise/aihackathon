class Ui::RetryButtonComponent < ApplicationComponent
  def initialize(label: '再生成')
    @label = label
  end

  def call
    content_tag(:button, type: 'button', class: 'retry-button') do
      concat(render(Ui::IconComponent.new(name: 'sparkles', size: 12)))
      concat(@label)
    end
  end
end
