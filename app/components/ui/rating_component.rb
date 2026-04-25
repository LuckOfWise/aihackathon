class Ui::RatingComponent < ApplicationComponent
  # rubocop:disable Layout/LineLength
  STAR_SVG_PATH = '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>'.freeze
  # rubocop:enable Layout/LineLength

  def initialize(value: 0, max: 5, readonly: true)
    @value = value.to_i
    @max = max
    @readonly = readonly
  end

  def call
    star_svg = STAR_SVG_PATH.html_safe # rubocop:disable Rails/OutputSafety

    content_tag(:div, class: 'rating', role: 'img', 'aria-label': "#{@value} / #{@max}") do
      safe_join((1..@max).map do |i|
        content_tag((@readonly ? :span : :button), type: (@readonly ? nil : :button),
                                                   class: ['rating__star', ('is-active' if i <= @value)].compact.join(' ')) do
          "<svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>#{star_svg}</svg>".html_safe # rubocop:disable Rails/OutputSafety
        end
      end)
    end
  end
end
