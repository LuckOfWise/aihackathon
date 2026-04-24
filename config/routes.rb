Rails.application.routes.draw do
  get 'up' => 'rails/health#show', as: :rails_health_check

  get 'styleguide' => 'styleguide#show', as: :styleguide

  resources :items

  namespace :playground do
    resource :stream, only: %i[show create], controller: 'streams'
    resource :vision, only: %i[show create], controller: 'visions'
    resource :extract, only: %i[show create], controller: 'extracts'
  end

  root 'items#index'
end
