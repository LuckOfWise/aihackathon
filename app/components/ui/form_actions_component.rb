class Ui::FormActionsComponent < ApplicationComponent
  def initialize(align: :end)
    @align = align.to_sym
  end

  def call
    content_tag(:div, content, class: 'form-actions', data: { align: @align })
  end
end
