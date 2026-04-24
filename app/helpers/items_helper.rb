module ItemsHelper
  STATUS_VARIANTS = {
    'draft' => :warning,
    'published' => :success,
    'archived' => :default,
  }.freeze

  def status_variant(status)
    STATUS_VARIANTS.fetch(status.to_s, :default)
  end
end
