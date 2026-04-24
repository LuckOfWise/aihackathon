class Ui::AIBadgeComponent < ApplicationComponent
  def initialize(label: 'AI 生成')
    @label = label
  end

  def call
    content_tag(:span, class: 'ai-badge', 'aria-label': 'AI 生成コンテンツ') do
      concat(render(Ui::IconComponent.new(name: 'sparkles', size: 12)))
      concat(@label)
    end
  end
end
