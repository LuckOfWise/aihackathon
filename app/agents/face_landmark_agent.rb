# frozen_string_literal: true

class FaceLandmarkAgent < ApplicationAgent
  generate_with :anthropic, model: 'claude-sonnet-4-5'

  DETECT_TOOL = {
    name: 'report_face_landmarks',
    description: 'Report detected face landmarks with normalized coordinates (0.0-1.0)',
    input_schema: {
      type: 'object',
      properties: {
        image_size: {
          type: 'object',
          properties: {
            width: { type: 'integer' },
            height: { type: 'integer' },
          },
          required: %w[width height],
        },
        face: {
          oneOf: [
            {
              type: 'object',
              properties: {
                confidence: { type: 'number', minimum: 0.0, maximum: 1.0 },
                bounding_box: {
                  type: 'object',
                  properties: {
                    x: { type: 'number' },
                    y: { type: 'number' },
                    w: { type: 'number' },
                    h: { type: 'number' },
                  },
                  required: %w[x y w h],
                },
                eyes: {
                  type: 'object',
                  properties: {
                    left: { '$ref': '#/$defs/eye' },
                    right: { '$ref': '#/$defs/eye' },
                  },
                  required: %w[left right],
                },
                mouth: {
                  type: 'object',
                  properties: {
                    state: {
                      type: 'string',
                      enum: %w[open_showing_teeth open_no_teeth closed],
                    },
                    teeth_polygon: {
                      oneOf: [
                        { type: 'null' },
                        { type: 'array', items: { '$ref': '#/$defs/point' } },
                      ],
                    },
                  },
                  required: %w[state],
                },
              },
              required: %w[confidence bounding_box eyes mouth],
            },
            { type: 'null' },
          ],
        },
      },
      required: %w[image_size face],
      '$defs': {
        point: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' },
          },
          required: %w[x y],
        },
        eye: {
          type: 'object',
          properties: {
            state: { type: 'string', enum: %w[open closed] },
            iris_center: { '$ref': '#/$defs/point' },
            iris_radius: { type: 'number' },
            eye_polygon: { type: 'array', items: { '$ref': '#/$defs/point' } },
          },
          required: %w[state iris_center iris_radius eye_polygon],
        },
      },
    },
  }.freeze

  INTENSITY_TOOL = {
    name: 'report_recommended_intensity',
    description: 'Recommend the shine enhancement intensity for the photo',
    input_schema: {
      type: 'object',
      properties: {
        intensity: {
          type: 'string',
          enum: %w[subtle standard sparkle],
        },
        reason: { type: 'string' },
      },
      required: %w[intensity reason],
    },
  }.freeze

  def detect
    @image = params[:image]
    prompt(
      image: @image,
      tools: [DETECT_TOOL],
      tool_choice: { type: 'tool', name: 'report_face_landmarks' }
    )
  end

  def recommend_intensity
    @image = params[:image]
    prompt(
      image: @image,
      tools: [INTENSITY_TOOL],
      tool_choice: { type: 'tool', name: 'report_recommended_intensity' }
    )
  end

  def advise_retake
    @image = params[:image]
    @failure_reason = params[:failure_reason]
    prompt(image: @image)
  end
end
