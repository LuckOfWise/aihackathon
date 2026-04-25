Rails.application.routes.draw do
  get 'up' => 'rails/health#show', as: :rails_health_check

  get 'styleguide' => 'styleguide#show', as: :styleguide

  resources :items, only: %i[index show new edit create update destroy]

  namespace :playground do
    resource :stream, only: %i[show create], controller: 'streams'
    resource :vision, only: %i[show create], controller: 'visions'
    resource :extract, only: %i[show create], controller: 'extracts'
  end

  namespace :api do
    resources :face_analyses, only: :create
    resources :shine_reviews, only: :create
    resources :enhancements, only: :create
  end

  namespace :debug do
    resource :face_shine, only: %i[show create], controller: 'face_shine'
  end

  resource :face_shine, only: :show, controller: 'face_shine'

  root 'face_shine#show'
end
