class Ui::DenseListRowComponent < ApplicationComponent
  # 既存 .dense-list__row SCSS を使う。任意列数に対応するラッパー。
  def initialize(columns:, href: nil)
    @columns = columns
    @href = href
  end

  def call
    template = @columns.join(' ')
    if @href
      link_to @href, class: 'dense-list__row', style: "grid-template-columns: #{template};" do
        content
      end
    else
      content_tag(:div, content, class: 'dense-list__row', style: "grid-template-columns: #{template};")
    end
  end
end
