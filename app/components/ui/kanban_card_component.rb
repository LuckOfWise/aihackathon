class Ui::KanbanCardComponent < ApplicationComponent
  def initialize(title:, meta: nil)
    @title = title
    @meta = meta
  end

  def call
    content_tag(:article, class: 'kanban-card') do
      concat(content_tag(:h4, @title, class: 'kanban-card__title'))
      concat(content_tag(:div, content, class: 'kanban-card__body')) if content.present?
      concat(content_tag(:div, @meta, class: 'kanban-card__meta')) if @meta
    end
  end
end
