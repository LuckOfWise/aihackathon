class Ui::CodeDiffComponent < ApplicationComponent
  def initialize(lines:)
    @lines = lines
  end

  def call
    content_tag(:pre, class: 'code-diff') do
      safe_join(@lines.map do |line|
        content_tag(:span, line.fetch(:prefix, sign(line[:kind])) + line[:text],
                    class: 'code-diff__line', data: { kind: line[:kind] })
      end)
    end
  end

  private

  def sign(kind)
    { add: '+ ', remove: '- ', context: '  ' }.fetch(kind.to_sym, '  ')
  end
end
