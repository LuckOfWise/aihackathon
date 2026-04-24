class Ui::LoadingOverlayComponent < ApplicationComponent
  def call
    content_tag(:div, class: 'loading-overlay', role: 'status') do
      render(Ui::SpinnerComponent.new(size: :lg))
    end
  end
end
