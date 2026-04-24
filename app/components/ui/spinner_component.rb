class Ui::SpinnerComponent < ApplicationComponent
  def initialize(size: :md, label: '読み込み中')
    @size = size.to_sym
    @label = label
  end

  def call
    content_tag(:span, '', class: 'spinner', data: { size: @size }, role: 'status', 'aria-label': @label)
  end
end
