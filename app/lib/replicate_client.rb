# frozen_string_literal: true

require 'net/http'
require 'json'

# Replicate API のシンプルな HTTP クライアント。
# 公式 SDK が無いため Net::HTTP で直接叩く。
# `Prefer: wait=60` を付けて同期レスポンスを取りに行き、まだ未完なら最大 60 秒ポーリング。
class ReplicateClient
  API_BASE = 'https://api.replicate.com/v1'
  POLL_INTERVAL = 1.5
  POLL_TIMEOUT = 90

  class Error < StandardError; end

  def initialize(api_token: Rails.application.credentials.dig(:replicate, :api_token))
    @api_token = api_token
    raise Error, 'Replicate API token is not configured' if @api_token.blank?
  end

  # version_or_model: "owner/name" or "owner/name:version-hash"
  # input: hash → JSON encoded as request body
  # 戻り値: prediction の最終 hash（output / status / error 等を含む）
  def run(version_or_model, input)
    prediction = create_prediction(version_or_model, input)
    poll_until_terminal(prediction)
  end

  private

  def create_prediction(version_or_model, input)
    if version_or_model.include?(':')
      _model, version = version_or_model.split(':', 2)
      body = { version:, input: }
      url = "#{API_BASE}/predictions"
    else
      body = { input: }
      url = "#{API_BASE}/models/#{version_or_model}/predictions"
    end
    request_json(:post, url, body, prefer_wait: true)
  end

  def poll_until_terminal(prediction)
    start = Time.current
    loop do
      return prediction if terminal?(prediction)
      raise Error, 'Replicate polling timeout' if Time.current - start > POLL_TIMEOUT

      sleep(POLL_INTERVAL)
      prediction = request_json(:get, prediction.fetch('urls').fetch('get'), nil)
    end
  end

  def terminal?(prediction)
    %w[succeeded failed canceled].include?(prediction['status'])
  end

  def request_json(method, url, body, prefer_wait: false)
    uri = URI(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 75

    req =
      case method
      when :post then Net::HTTP::Post.new(uri.request_uri)
      when :get then Net::HTTP::Get.new(uri.request_uri)
      else raise ArgumentError, "Unsupported method #{method}"
      end

    req['Authorization'] = "Bearer #{@api_token}"
    req['Content-Type'] = 'application/json'
    req['Prefer'] = 'wait=60' if prefer_wait
    req.body = body.to_json if body

    res = http.request(req)
    parsed = JSON.parse(res.body) rescue {}

    return parsed if res.code.to_i.between?(200, 299)

    raise Error, "Replicate API #{res.code}: #{parsed['detail'] || res.body}"
  end
end
