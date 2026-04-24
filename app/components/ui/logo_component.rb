class Ui::LogoComponent < ApplicationComponent
  def initialize(name:, icon: 'sparkles')
    @name = name
    @icon = icon
  end

  def call
    content_tag(:span, class: 'logo') do
      concat(content_tag(:span, class: 'logo__mark') do
        render(Ui::IconComponent.new(name: @icon, size: 16))
      end)
      concat(content_tag(:span, @name, class: 'logo__wordmark'))
    end
  end
end
