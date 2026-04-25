# frozen_string_literal: true

# activeagent 1.0.1 + anthropic 1.36.0 の組み合わせで tool 呼び出しを伴う多段
# 推論を行うと、レスポンスメッセージに含まれる `stop_details` が次のリクエスト
# に混入し Anthropic API が 400 (Extra inputs are not permitted) を返す。
# `cleanup_serialized_request` でメッセージから `stop_details` も削除する。

require 'active_agent/providers/anthropic/transforms'

module ActiveAgent::Providers::Anthropic::Transforms
  class << self
    alias_method :__cleanup_serialized_request_without_stop_details, :cleanup_serialized_request

    def cleanup_serialized_request(hash, defaults, gem_object = nil)
      result = __cleanup_serialized_request_without_stop_details(hash, defaults, gem_object)
      result[:messages]&.each { |msg| msg.delete(:stop_details) }
      result
    end
  end
end
