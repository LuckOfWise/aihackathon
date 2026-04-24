class Ui::PromptVariableComponent < ApplicationComponent
  def call
    content_tag(:span, content, class: 'prompt-variable')
  end
end
