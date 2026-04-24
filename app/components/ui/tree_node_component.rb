class Ui::TreeNodeComponent < ApplicationComponent
  def initialize(nodes:)
    @nodes = nodes
  end

  def call
    render_nodes(@nodes)
  end

  private

  def render_nodes(nodes)
    content_tag(:ul, class: 'tree-node') do
      safe_join(nodes.map do |n|
        content_tag(:li, class: 'tree-node__item') do
          concat(content_tag(:span, n[:label], class: 'tree-node__label'))
          concat(render_nodes(n[:children])) if n[:children].present?
        end
      end)
    end
  end
end
