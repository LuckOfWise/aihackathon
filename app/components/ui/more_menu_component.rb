class Ui::MoreMenuComponent < ApplicationComponent
  def initialize(items:)
    @items = items
  end

  attr_reader :items
end
