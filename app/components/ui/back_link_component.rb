class Ui::BackLinkComponent < ApplicationComponent
  def initialize(href:, title: '戻る')
    @href = href
    @title = title
  end

  def call
    link_to @href, class: 'back-link', title: @title, 'aria-label': @title do
      render(Ui::IconComponent.new(name: 'arrow-left'))
    end
  end
end
