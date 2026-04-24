class Ui::JsonViewComponent < ApplicationComponent
  def initialize(data:)
    @data = data
  end

  def call
    content_tag(:pre, class: 'json-view') do
      JSON.pretty_generate(@data)
    end
  end
end
