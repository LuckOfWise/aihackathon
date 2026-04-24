class Ui::ThumbnailComponent < ApplicationComponent
  def initialize(src:, alt: '', size: :md)
    @src = src
    @alt = alt
    @size = size.to_sym
  end

  def call
    tag.img(src: @src, alt: @alt, class: 'thumbnail', data: { size: @size })
  end
end
