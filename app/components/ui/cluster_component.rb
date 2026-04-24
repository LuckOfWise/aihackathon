class Ui::ClusterComponent < ApplicationComponent
  def call
    content_tag(:div, content, class: 'cluster')
  end
end
