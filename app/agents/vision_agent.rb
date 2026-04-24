class VisionAgent < ApplicationAgent
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  def describe
    @image = params[:image]
    @instruction = params[:instruction].presence || 'この画像に写っているものを説明してください。'
    prompt(image: @image)
  end
end
