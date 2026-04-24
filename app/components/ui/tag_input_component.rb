class Ui::TagInputComponent < ApplicationComponent
  def initialize(name:, tags: [], placeholder: 'Enter で追加')
    @name = name
    @tags = tags
    @placeholder = placeholder
  end

  def call
    content_tag(:div, class: 'tag-input') do
      tags_html = @tags.map do |tag|
        content_tag(:span, class: 'tag-input__tag') do
          concat("##{tag}")
          concat(content_tag(:button, '×', type: 'button', class: 'tag-input__remove', 'aria-label': '削除'))
        end
      end
      concat(safe_join(tags_html))
      concat(tag.input(type: :text, name: @name, placeholder: @placeholder, class: 'tag-input__field'))
    end
  end
end
