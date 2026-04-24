class Ui::NavbarComponent < ApplicationComponent
  renders_one :brand
  renders_many :links
  renders_one :user_menu

  def initialize(user: nil)
    @user = user
  end

  attr_reader :user

  def avatar_initial
    return 'G' if user.blank?

    source = user.try(:name).presence || user.try(:email).to_s
    source.first&.upcase || '?'
  end

  def user_display_name
    user.try(:name).presence || user.try(:email) || 'Guest'
  end
end
