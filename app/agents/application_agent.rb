class ApplicationAgent < ActiveAgent::Base
  generate_with :anthropic,
                model: 'claude-sonnet-4-5',
                instructions: 'You are a helpful assistant.'
end
