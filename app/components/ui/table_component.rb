class Ui::TableComponent < ApplicationComponent
  def initialize(headers:, rows:)
    @headers = headers
    @rows = rows
  end

  attr_reader :headers, :rows
end
