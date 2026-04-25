source 'https://rubygems.org'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 8.1.3'

# Asset pipeline / CSS
gem 'dartsass-rails'
gem 'propshaft'

# Database
gem 'pg', '~> 1.1'

# Web server
gem 'puma', '>= 5.0'

# Hotwire (Pattern A)
gem 'stimulus-rails'
gem 'turbo-rails'

# Vite integration (replaces jsbundling/importmap)
gem 'vite_rails'

# Time zone data on Windows/JRuby
gem 'tzinfo-data', platforms: %i[windows jruby]

# Database-backed adapters for Rails.cache / Active Job / Action Cable
gem 'solid_cable'
gem 'solid_cache'
gem 'solid_queue'

# Boot speed-up
gem 'bootsnap', require: false

# Deployment
gem 'kamal', require: false
gem 'thruster', require: false

# Active Storage variants
gem 'image_processing', '~> 1.2'

# Active Storage S3 adapter
gem 'aws-sdk-s3', require: false

# i18n & locale
gem 'rails-i18n'

# 認証・認可
gem 'action_policy'
gem 'devise'

# モデル支援
gem 'draper'
gem 'enumerize'
gem 'kaminari'
gem 'ransack'

# UI (Pattern A: Hotwire)
gem 'simple_form'
gem 'view_component'

# AI / Agent Oriented Programming
gem 'activeagent'
gem 'anthropic'

# 監視・ログ
gem 'lograge'
gem 'sentry-rails'
gem 'sentry-ruby'

group :development, :test do
  # Debugger
  gem 'debug', platforms: %i[mri windows], require: 'debug/prelude'

  # RSpec stack
  gem 'capybara'
  gem 'factory_bot_rails'
  gem 'rspec-rails'
  gem 'selenium-webdriver'

  # Security & audit
  gem 'brakeman', require: false
  gem 'bundler-audit', require: false

  # Linters / style
  gem 'erb_lint', require: false
  gem 'sgcop', require: false, github: 'SonicGarden/sgcop'

  # Git hooks
  gem 'lefthook', require: false
end

group :development do
  # Exception console
  gem 'web-console'
end
