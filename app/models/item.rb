class Item < ApplicationRecord
  extend Enumerize

  STATUSES = %i[draft published archived].freeze

  enumerize :status, in: STATUSES, default: :draft, predicates: { prefix: true }, scope: true

  has_one_attached :image

  validates :title, presence: true, length: { maximum: 120 }
  validates :body, length: { maximum: 10_000 }

  scope :default_order, -> { order(created_at: :desc, id: :desc) }

  def excerpt(limit: 80)
    body.to_s.strip.truncate(limit, separator: /\s/)
  end
end
