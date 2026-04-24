class Ui::GridComponent < ApplicationComponent
  def initialize(cols: 2)
    @cols = cols.to_i
  end

  def call
    content_tag(:div, content, class: 'grid', data: { cols: @cols })
  end
end
