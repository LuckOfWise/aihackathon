class Ui::ImageComponent < ApplicationComponent
  def initialize(src:, alt: '', ratio: '16:9')
    @src = src
    @alt = alt
    @ratio = ratio
  end

  def call
    content_tag(:div, class: 'frame', data: { ratio: @ratio }) do
      tag.img(src: @src, alt: @alt)
    end
  end
end
