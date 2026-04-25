# frozen_string_literal: true

class ShineReviewAgent < ApplicationAgent
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  SCORE_TOOL = {
    name: 'report_shine_score',
    description: 'Report the shine enhancement score comparing before and after images',
    input_schema: {
      type: 'object',
      properties: {
        score: { type: 'integer', minimum: 0, maximum: 100 },
        summary: { type: 'string' },
        metrics: {
          type: 'object',
          properties: {
            eye_luminance_delta_percent: { type: 'number' },
            enamel_chroma_delta_percent: { type: 'number' },
            attract_index_delta: { type: 'number' },
          },
          required: %w[eye_luminance_delta_percent enamel_chroma_delta_percent attract_index_delta],
        },
      },
      required: %w[score summary metrics],
    },
  }.freeze

  VALIDATE_TOOL = {
    name: 'report_quality_validation',
    description: 'Validate the quality of the enhanced image',
    input_schema: {
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        issues: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: %w[ok issues],
    },
  }.freeze

  def comment
    @shined_image = params[:shined_image]
    prompt(image: @shined_image, model: 'claude-haiku-4-5')
  end

  def score
    @original_image = params[:original_image]
    @shined_image   = params[:shined_image]
    prompt(
      messages: [
        { image: @original_image },
        { image: @shined_image },
      ],
      tools: [SCORE_TOOL],
      tool_choice: { type: 'tool', name: 'report_shine_score' }
    )
  end

  def validate_quality
    @shined_image = params[:shined_image]
    prompt(
      image: @shined_image,
      tools: [VALIDATE_TOOL],
      tool_choice: { type: 'tool', name: 'report_quality_validation' }
    )
  end

  def report_shine_score(**input)
    store_tool_result(input)
  end

  def report_quality_validation(**input)
    store_tool_result(input)
  end
end
