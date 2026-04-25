# frozen_string_literal: true

class Debug::FaceShineController < ApplicationController
  before_action :require_development

  def show
    @preview_data_url = nil
    @landmarks = nil
    @error = nil
  end

  def create
    uploaded_file = params.fetch(:image, params[:file])

    if uploaded_file.blank?
      @error = '画像を選択してください'
      return render :show, status: :unprocessable_content
    end

    if uploaded_file.size > 5.megabytes
      @error = 'ファイルサイズは5MB以下にしてください'
      return render :show, status: :unprocessable_content
    end

    encoded = Base64.strict_encode64(uploaded_file.read)
    @preview_data_url = "data:#{uploaded_file.content_type};base64,#{encoded}"

    response = FaceLandmarkAgent
               .with(image: @preview_data_url)
               .detect
               .generate_now

    @landmarks = extract_tool_input(response)
    render :show
  rescue StandardError => e
    @error = "解析エラー: #{e.message}"
    render :show, status: :unprocessable_content
  end

  private

  def require_development
    render plain: 'Not available in this environment', status: :not_found unless Rails.env.development?
  end

  def extract_tool_input(response)
    content = response.message.content
    return nil unless content.is_a?(Array)

    tool_block = content.find { |block| block.is_a?(Hash) && block[:type] == 'tool_use' }
    return nil unless tool_block

    input = tool_block[:input]
    return nil unless input.is_a?(Hash)

    input.deep_symbolize_keys
  end
end
