class Ui::SearchFieldComponent < ApplicationComponent
  def initialize(name: :q, value: nil, placeholder: '検索', kbd: nil)
    @name = name
    @value = value
    @placeholder = placeholder
    @kbd = kbd
  end

  def call
    content_tag(:div, class: 'search-field') do
      concat(content_tag(:span, class: 'search-field__icon') { render(Ui::IconComponent.new(name: 'search', size: 16)) })
      concat(tag.input(type: :search, name: @name, value: @value, placeholder: @placeholder, class: 'search-field__input'))
      if @kbd
        concat(content_tag(:span, class: 'search-field__kbd') do
          render(Ui::KbdComponent.new.with_content(@kbd))
        end)
      end
    end
  end
end
