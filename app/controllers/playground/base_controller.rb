class Playground::BaseController < ApplicationController
  private

  def data_url_from(uploaded_file)
    return nil if uploaded_file.blank?

    encoded = Base64.strict_encode64(uploaded_file.read)
    "data:#{uploaded_file.content_type};base64,#{encoded}"
  end
end
