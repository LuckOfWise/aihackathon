class Ui::IconComponent < ApplicationComponent
  # Minimal Lucide-style SVG icon set. Extend as needed.
  ICONS = {
    'chevron-down' => '<path d="m6 9 6 6 6-6"/>',
    'chevron-left' => '<path d="m15 18-6-6 6-6"/>',
    'chevron-right' => '<path d="m9 18 6-6-6-6"/>',
    'arrow-left' => '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'plus' => '<path d="M5 12h14"/><path d="M12 5v14"/>',
    'check' => '<path d="M20 6 9 17l-5-5"/>',
    'x' => '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'more-vertical' => '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    'file' => '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5z"/><polyline points="14 2 14 8 20 8"/>',
    'sparkles' => '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>', # rubocop:disable Layout/LineLength
    'send' => '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    'image' => '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    'user' => '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'log-out' => '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
    'trash' => '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    'search' => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'inbox' => '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>', # rubocop:disable Layout/LineLength
  }.freeze

  def initialize(name:, size: 20, stroke_width: 2)
    @name = name.to_s
    @size = size
    @stroke_width = stroke_width
  end

  attr_reader :name, :size, :stroke_width

  def path
    ICONS.fetch(name) { raise ArgumentError, "Unknown icon: #{name}. Add to Ui::IconComponent::ICONS" }
  end

  def call
    content_tag(
      :svg,
      path.html_safe, # rubocop:disable Rails/OutputSafety
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': stroke_width,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true'
    )
  end
end
