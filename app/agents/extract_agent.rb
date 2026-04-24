class ExtractAgent < ApplicationAgent
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  def summarize
    @text = params[:text]
    prompt(response_format: :json)
  end
end
