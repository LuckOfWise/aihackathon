class Ui::PanelComponent < ApplicationComponent
  renders_one :header
  renders_one :footer

  def call
    content_tag(:section, class: 'panel') do
      concat(content_tag(:header, header, class: 'panel__header')) if header?
      concat(content_tag(:div, content, class: 'panel__body'))
      concat(content_tag(:footer, footer, class: 'panel__footer')) if footer?
    end
  end
end
