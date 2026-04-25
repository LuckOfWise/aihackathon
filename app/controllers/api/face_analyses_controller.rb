# frozen_string_literal: true

class Api::FaceAnalysesController < Api::ApplicationController
  def create
    data_url = data_url_from(params[:file])

    if data_url.blank?
      render json: { error: 'no_file', message: '画像ファイルを選択してください' }, status: :unprocessable_content
      return
    end

    landmarks, intensity_result = run_parallel_analysis(data_url)
    render_analysis_result(data_url, landmarks, intensity_result)
  rescue StandardError => e
    Rails.logger.error("FaceAnalysesController#create error: #{e.message}\n#{e.backtrace.first(5).join("\n")}")
    render json: { error: 'internal_error', message: 'AI解析中にエラーが発生しました' }, status: :internal_server_error
  end

  private

  def render_analysis_result(data_url, landmarks, intensity_result)
    face = landmarks[:face]
    return render_no_face(data_url, 'no_face_detected') if face.nil?
    return render_no_face(data_url, 'low_confidence') if low_confidence?(face)

    render json: {
      landmarks:,
      recommended_intensity: intensity_result[:intensity],
      intensity_reason: intensity_result[:reason],
    }
  end

  def low_confidence?(face)
    face[:confidence] && face[:confidence] < 0.3
  end

  def render_no_face(data_url, error_key)
    advice = fetch_retake_advice(data_url, error_key)
    render json: { error: error_key, advice: }, status: :unprocessable_content
  end

  def run_parallel_analysis(data_url)
    landmarks_thread = Thread.new do
      ApplicationAgent.capture_tool_result do
        FaceLandmarkAgent.with(image: data_url).detect.generate_now
      end || {}
    end

    intensity_thread = Thread.new do
      ApplicationAgent.capture_tool_result do
        FaceLandmarkAgent.with(image: data_url).recommend_intensity.generate_now
      end || { intensity: 'standard', reason: '標準設定を使用します' }
    end

    [landmarks_thread.value, intensity_thread.value]
  end

  def fetch_retake_advice(data_url, reason)
    response = FaceLandmarkAgent.with(image: data_url, failure_reason: reason).advise_retake.generate_now
    response.message.content.to_s
  rescue StandardError
    '写真を撮り直してください。正面を向いて、明るい場所で撮影してみてください。'
  end
end
