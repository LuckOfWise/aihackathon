# frozen_string_literal: true

class Debug::FaceShineController < ApplicationController
  before_action :require_development

  def show; end

  private

  def require_development
    render plain: 'Not available in this environment', status: :not_found unless Rails.env.development?
  end
end
