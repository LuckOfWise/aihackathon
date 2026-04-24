class Ui::FileUploadComponent < ApplicationComponent
  def initialize(name:, accept: nil, label: 'ファイルを選択', hint: nil, multiple: false)
    @name = name
    @accept = accept
    @label = label
    @hint = hint
    @multiple = multiple
  end

  def call
    content_tag(:label, class: 'file-upload') do
      concat(content_tag(:span, class: 'file-upload__icon') { render(Ui::IconComponent.new(name: 'image', size: 24)) })
      concat(content_tag(:span, @label, class: 'file-upload__label'))
      concat(content_tag(:span, @hint, class: 'file-upload__hint')) if @hint
      concat(tag.input(type: :file, name: @name, accept: @accept, multiple: @multiple, class: 'file-upload__input'))
    end
  end
end
