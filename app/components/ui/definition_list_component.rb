class Ui::DefinitionListComponent < ApplicationComponent
  def initialize(items:)
    @items = items
  end

  def call
    content_tag(:dl, class: 'definition-list') do
      safe_join(@items.map do |key, value|
        safe_join([content_tag(:dt, key), content_tag(:dd, value)])
      end)
    end
  end
end
