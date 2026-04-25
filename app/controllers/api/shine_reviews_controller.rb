# frozen_string_literal: true

class Api::ShineReviewsController < Api::ApplicationController
  include ActionController::Live

  def create
    original_data_url = data_url_from(params[:original_file])
    shined_data_url   = data_url_from(params[:shined_file])

    if original_data_url.blank? || shined_data_url.blank?
      render json: { error: 'missing_files', message: '元画像と加工後画像の両方が必要です' }, status: :unprocessable_content
      return
    end

    setup_sse_headers
    begin
      stream_shine_review(original_data_url, shined_data_url)
    ensure
      response.stream.close
    end
  rescue ActionController::Live::ClientDisconnected
    # Client disconnected
  rescue StandardError => e
    Rails.logger.error("ShineReviewsController#create error: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
    send_sse_event('error', { message: 'AI解析中にエラーが発生しました' })
  end

  private

  def setup_sse_headers
    response.headers['Content-Type']     = 'text/event-stream'
    response.headers['Cache-Control']    = 'no-cache'
    response.headers['X-Accel-Buffering'] = 'no'
  end

  def stream_shine_review(original_data_url, shined_data_url)
    intensity = params[:intensity].to_s
    validate  = params[:validate] == 'true'

    comment_thread  = Thread.new { stream_comment(shined_data_url) }
    score_thread    = Thread.new { fetch_score(original_data_url, shined_data_url) }
    validate_thread = Thread.new { fetch_validation(shined_data_url) } if validate && %w[sparkle overdo].include?(intensity)

    comment_thread.join

    score_result = score_thread.value
    send_sse_event('score', score_result) if score_result

    if validate_thread
      validate_result = validate_thread.value
      send_sse_event('validate', validate_result) if validate_result
    end

    send_sse_event('done', {})
  end

  def stream_comment(shined_data_url)
    ShineReviewAgent
      .with(shined_image: shined_data_url)
      .comment
      .generate_now
      .message
      .content
      .to_s
      .chars
      .each_slice(5) { |chunk| send_sse_event('comment_chunk', { text: chunk.join }) }
  rescue StandardError => e
    Rails.logger.error("stream_comment error: #{e.message}")
  end

  def fetch_score(original_data_url, shined_data_url)
    ApplicationAgent.capture_tool_result do
      ShineReviewAgent
        .with(original_image: original_data_url, shined_image: shined_data_url)
        .score
        .generate_now
    end
  rescue StandardError => e
    Rails.logger.error("fetch_score error: #{e.message}")
    nil
  end

  def fetch_validation(shined_data_url)
    ApplicationAgent.capture_tool_result do
      ShineReviewAgent.with(shined_image: shined_data_url).validate_quality.generate_now
    end
  rescue StandardError => e
    Rails.logger.error("fetch_validation error: #{e.message}")
    nil
  end

  def send_sse_event(event, data)
    response.stream.write("event: #{event}\n")
    response.stream.write("data: #{data.to_json}\n\n")
  end
end
