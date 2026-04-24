class Ui::AudioPlayerComponent < ApplicationComponent
  def initialize(src:)
    @src = src
  end

  def call
    content_tag(:div, class: 'audio-player') do
      tag.audio(src: @src, controls: true, preload: 'metadata')
    end
  end
end
