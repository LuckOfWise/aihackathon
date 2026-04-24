class ChatAgent < ApplicationAgent
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  def reply
    @message = params[:message]
    prompt
  end
end
