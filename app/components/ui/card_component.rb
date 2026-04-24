class Ui::CardComponent < ApplicationComponent
  renders_one :title
  renders_one :meta
  renders_one :footer

  def initialize(title_text: nil)
    @title_text = title_text
  end

  attr_reader :title_text

  def render?
    content.present? || title? || title_text.present?
  end
end
