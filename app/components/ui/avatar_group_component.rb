class Ui::AvatarGroupComponent < ApplicationComponent
  def initialize(users:, size: :md, max: 4)
    @users = users
    @size = size
    @max = max
  end

  attr_reader :users, :size, :max

  def visible
    users.first(max)
  end

  def remaining
    [users.size - max, 0].max
  end
end
