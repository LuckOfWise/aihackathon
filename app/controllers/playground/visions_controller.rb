class Playground::VisionsController < Playground::BaseController
  def show
    @instruction = nil
    @response = nil
    @preview = nil
  end

  def create
    @instruction = params[:instruction].to_s.strip
    image = params[:image]
    data_url = data_url_from(image)

    if data_url.blank?
      flash.now[:alert] = '画像を選択してください'
      return render :show, status: :unprocessable_entity
    end

    @preview = data_url
    @response = VisionAgent
      .with(image: data_url, instruction: @instruction)
      .describe
      .generate_now
      .message
      .content
    render :show
  rescue StandardError => e
    flash.now[:alert] = "生成に失敗しました: #{e.message}"
    render :show, status: :unprocessable_entity
  end
end
