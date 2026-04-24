class ApplicationQuery
  def self.call(...) = new(...).call

  def initialize(scope = nil) = @scope = scope
end
