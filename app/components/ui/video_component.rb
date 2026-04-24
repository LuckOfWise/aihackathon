class Ui::VideoComponent < ApplicationComponent
  def initialize(src:, ratio: '16:9', poster: nil)
    @src = src
    @ratio = ratio
    @poster = poster
  end

  def call
    content_tag(:div, class: 'frame', data: { ratio: @ratio }) do
      tag.video(src: @src, poster: @poster, controls: true, preload: 'metadata')
    end
  end
end
