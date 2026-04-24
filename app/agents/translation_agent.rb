class TranslationAgent < ApplicationAgent
  def translate
    @message = params[:message]
    @locale = params[:locale]
    prompt
  end
end
