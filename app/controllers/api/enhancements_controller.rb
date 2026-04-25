# frozen_string_literal: true

class Api::EnhancementsController < Api::ApplicationController
  # CodeFormer: 顔の復元・高画質化モデル。生成ではなく復元のため identity は完全保持。
  # InstantID 系の生成モデルだと別人になりやすいため CodeFormer に切り替え、
  # クライアント側で更に Canvas filter（overdo パラメータ）の輝き合成を重ねる構成。
  CODEFORMER_MODEL = 'sczhou/codeformer:cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2'

  def create
    data_url = data_url_from(params[:file])

    if data_url.blank?
      return render json: { error: 'no_file', message: '画像ファイルを選択してください' }, status: :unprocessable_content
    end

    prediction = client.run(CODEFORMER_MODEL, build_input(data_url))

    if prediction['status'] != 'succeeded'
      Rails.logger.warn("Replicate prediction failed: #{prediction['error'] || prediction['status']}")
      return render json: { error: 'enhancement_failed', message: 'AI による画像強化に失敗しました' },
                    status: :bad_gateway
    end

    image_url = Array(prediction['output']).first
    if image_url.blank?
      return render json: { error: 'no_output', message: 'AI からの応答に画像が含まれていません' },
                    status: :bad_gateway
    end

    render json: { enhanced_image_url: image_url }
  rescue ReplicateClient::Error => e
    Rails.logger.error("Replicate error: #{e.message}")
    render json: { error: 'replicate_error', message: "AI 画像強化サービスに接続できませんでした: #{e.message}" },
           status: :bad_gateway
  end

  private

  def client
    @client ||= ReplicateClient.new
  end

  def build_input(data_url)
    {
      image: data_url,
      codeformer_fidelity: 0.9,   # identity 寄り。0=画質優先, 1=identity完全保持
      background_enhance: false,  # 速度優先のため背景は触らない
      face_upsample: true,        # 顔領域だけ高解像度化
      upscale: 2,                 # 顔を 2 倍までシャープ化
    }
  end
end
