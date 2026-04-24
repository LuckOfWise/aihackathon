class Ui::SegmentControlComponent < ApplicationComponent
  def initialize(items:, active:)
    @items = items
    @active = active.to_s
  end

  def call
    content_tag(:div, class: 'segment-control', role: 'tablist') do
      safe_join(@items.map do |label, value|
        v = (value || label).to_s
        content_tag(:button, label, type: 'button', class: ['segment-control__item', ('is-active' if v == @active)].compact.join(' '))
      end)
    end
  end
end
