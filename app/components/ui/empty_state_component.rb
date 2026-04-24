class Ui::EmptyStateComponent < ApplicationComponent
  renders_one :action

  def initialize(title:, hint: nil, icon: 'inbox')
    @title = title
    @hint = hint
    @icon = icon
  end

  attr_reader :title, :hint, :icon
end
