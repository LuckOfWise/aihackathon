class ApplicationAgent < ActiveAgent::Base
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  THREAD_LOCAL_TOOL_RESULT = :_active_agent_tool_result

  class << self
    def capture_tool_result
      Thread.current[THREAD_LOCAL_TOOL_RESULT] = nil
      yield
      Thread.current[THREAD_LOCAL_TOOL_RESULT]
    end
  end

  private

  def store_tool_result(input)
    Thread.current[THREAD_LOCAL_TOOL_RESULT] = input
    'ok'
  end
end
