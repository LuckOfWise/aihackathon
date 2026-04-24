class Ui::GalleryComponent < ApplicationComponent
  def initialize(images:)
    @images = images
  end

  def call
    content_tag(:div, class: 'gallery') do
      safe_join(@images.map do |img|
        content_tag(:figure, class: 'gallery__item') do
          tag.img(src: img[:src], alt: img[:alt].to_s)
        end
      end)
    end
  end
end
