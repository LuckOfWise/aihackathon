class Ui::SplitButtonComponent < ApplicationComponent
  def initialize(label:)
    @label = label
  end

  def call
    content_tag(:div, class: 'split-button') do
      concat(content_tag(:button, @label, type: 'button', class: 'split-button__main'))
      concat(content_tag(:button, type: 'button', class: 'split-button__toggle', title: 'その他') do
        render(Ui::IconComponent.new(name: 'chevron-down', size: 14))
      end)
    end
  end
end
