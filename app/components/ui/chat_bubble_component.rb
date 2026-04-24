class Ui::ChatBubbleComponent < ApplicationComponent
  ROLES = %i[user assistant system].freeze

  def initialize(role: :assistant, avatar: nil, meta: nil)
    @role = role.to_sym
    @avatar = avatar
    @meta = meta
  end

  def call
    content_tag(:div, class: 'chat-bubble', data: { role: @role }) do
      concat(content_tag(:div, class: 'chat-bubble__avatar') { render(Ui::AvatarComponent.new(name: @avatar || default_avatar)) })
      concat(content_tag(:div) do
        concat(content_tag(:div, content, class: 'chat-bubble__body'))
        concat(content_tag(:div, @meta, class: 'chat-bubble__meta')) if @meta
      end)
    end
  end

  private

  def default_avatar
    @role == :user ? 'U' : 'AI'
  end
end
