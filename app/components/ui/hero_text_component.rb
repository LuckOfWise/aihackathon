class Ui::HeroTextComponent < ApplicationComponent
  renders_one :lede

  def initialize(title:, mark: nil)
    @title = title
    @mark = mark
  end

  attr_reader :title, :mark
end
