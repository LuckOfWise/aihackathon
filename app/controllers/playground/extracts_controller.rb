class Playground::ExtractsController < Playground::BaseController
  def show
    @text = nil
    @response = nil
    @parsed = nil
  end

  def create
    @text = params[:text].to_s.strip

    if @text.blank?
      flash.now[:alert] = 'テキストを入力してください'
      return render :show, status: :unprocessable_entity
    end

    @response = ExtractAgent
      .with(text: @text)
      .summarize
      .generate_now
      .message
      .content

    @parsed = parse_json(@response)
    render :show
  rescue StandardError => e
    flash.now[:alert] = "生成に失敗しました: #{e.message}"
    render :show, status: :unprocessable_entity
  end

  private

  def parse_json(text)
    JSON.parse(text)
  rescue JSON::ParserError
    nil
  end
end
