class Ui::TokenMeterComponent < ApplicationComponent
  def initialize(used:, limit:)
    @used = used
    @limit = limit
  end

  def percentage
    [(@used.to_f / @limit * 100).round, 100].min
  end

  def level
    case percentage
    when 0..60 then :default
    when 61..85 then :warning
    else :danger
    end
  end

  def call
    content_tag(:div, class: 'token-meter') do
      concat(content_tag(:div, class: 'token-meter__top') do
        concat(content_tag(:span, 'TOKENS'))
        concat(content_tag(:span, "#{@used} / #{@limit}", class: 'token-meter__count'))
      end)
      concat(content_tag(:div, class: 'token-meter__bar') do
        content_tag(:div, '', class: 'token-meter__fill', style: "width: #{percentage}%", data: { level: level })
      end)
    end
  end
end
