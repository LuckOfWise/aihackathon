class Ui::SelectInputComponent < ApplicationComponent
  def initialize(name:, options:, selected: nil, include_blank: nil)
    @name = name
    @options = options
    @selected = selected
    @include_blank = include_blank
  end

  def call
    content_tag(:select, name: @name, class: 'input') do
      blank = @include_blank ? content_tag(:option, @include_blank, value: '') : ''
      opts = @options.map do |label, value|
        v = value || label
        content_tag(:option, label, value: v, selected: (v.to_s == @selected.to_s))
      end
      safe_join([blank, *opts])
    end
  end
end
