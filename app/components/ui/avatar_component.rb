class Ui::AvatarComponent < ApplicationComponent
  def initialize(name: nil, image_url: nil, size: :md)
    @name = name
    @image_url = image_url
    @size = size.to_sym
  end

  def call
    content_tag(:span, class: 'avatar', data: { size: @size }, 'aria-label': @name) do
      if @image_url.present?
        image_tag(@image_url, alt: @name.to_s)
      else
        @name.to_s.fetch(0, '?').upcase
      end
    end
  end
end
