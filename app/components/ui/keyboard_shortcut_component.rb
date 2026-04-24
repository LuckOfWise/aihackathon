class Ui::KeyboardShortcutComponent < ApplicationComponent
  def initialize(keys:)
    @keys = keys
  end

  def call
    content_tag(:span, class: 'keyboard-shortcut') do
      safe_join(@keys.each_with_index.flat_map do |key, i|
        items = [render(Ui::KbdComponent.new.with_content(key))]
        items << content_tag(:span, '+', class: 'keyboard-shortcut__plus') if i < @keys.size - 1
        items
      end)
    end
  end
end
