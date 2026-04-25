# frozen_string_literal: true

class Api::ApplicationController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :validate_file_size

  private

  def validate_file_size
    file = params.fetch(:file, params[:original_file]) || params[:shined_file]
    return if file.blank?

    if file.size > 5.megabytes
      render json: { error: 'file_too_large', message: 'ファイルサイズは5MB以下にしてください' }, status: :unprocessable_content
    end
  end

  def data_url_from(uploaded_file)
    return nil if uploaded_file.blank?

    encoded = Base64.strict_encode64(uploaded_file.read)
    "data:#{uploaded_file.content_type};base64,#{encoded}"
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
