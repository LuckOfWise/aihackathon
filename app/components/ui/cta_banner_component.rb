class Ui::CtaBannerComponent < ApplicationComponent
  renders_one :action

  def initialize(title:, lede: nil)
    @title = title
    @lede = lede
  end

  attr_reader :title, :lede
end
