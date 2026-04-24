class Playground::StreamsController < Playground::BaseController
  def show
    @message = nil
    @response = nil
  end

  def create
    @message = params[:message].to_s.strip
    @response = ChatAgent.with(message: @message).reply.generate_now.message.content if @message.present?
    render :show
  rescue StandardError => e
    flash.now[:alert] = "生成に失敗しました: #{e.message}"
    render :show, status: :unprocessable_entity
  end
end
