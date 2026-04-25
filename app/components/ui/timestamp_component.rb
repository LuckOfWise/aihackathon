class Ui::TimestampComponent < ApplicationComponent
  def initialize(time:, format: :short, absolute: true)
    @time = time
    @format = format
    @absolute = absolute
  end

  def call
    content_tag(
      :time,
      display_text,
      class: 'timestamp',
      datetime: @time.iso8601,
      title: @absolute ? I18n.l(@time, format: :long) : nil
    )
  end

  private

  def display_text
    I18n.l(@time, format: @format)
  end
end
