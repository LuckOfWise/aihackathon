class Ui::StatComponent < ApplicationComponent
  def initialize(label:, value:, delta: nil, delta_direction: nil)
    @label = label
    @value = value
    @delta = delta
    @delta_direction = delta_direction
  end

  attr_reader :label, :value, :delta, :delta_direction
end
