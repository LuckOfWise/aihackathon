class Ui::ModelBadgeComponent < ApplicationComponent
  def initialize(model:)
    @model = model
  end

  def call
    content_tag(:span, class: 'model-badge', title: @model) do
      concat(content_tag(:span, '', class: 'model-badge__dot', 'aria-hidden': 'true'))
      concat(@model)
    end
  end
end
