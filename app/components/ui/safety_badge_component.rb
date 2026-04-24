class Ui::SafetyBadgeComponent < ApplicationComponent
  LEVELS = %i[safe caution blocked].freeze

  def initialize(level: :safe, label: nil)
    @level = level.to_sym
    @label = label || { safe: 'SAFE', caution: 'CAUTION', blocked: 'BLOCKED' }[@level]
  end

  def call
    content_tag(:span, @label, class: 'safety-badge', data: { level: @level })
  end
end
