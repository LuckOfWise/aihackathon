import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = { current: String }

  connect() {
    this.apply(this.currentValue || this.#stored() || 'default')
  }

  set(event) {
    const theme = event.currentTarget.dataset.theme
    this.apply(theme)
    this.#store(theme)
  }

  apply(theme) {
    const html = document.documentElement
    if (theme === 'default') {
      html.removeAttribute('data-theme')
    } else {
      html.setAttribute('data-theme', theme)
    }
    this.currentValue = theme
    this.element.querySelectorAll('[data-theme]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.theme === theme)
    })
  }

  #stored() {
    try {
      return localStorage.getItem('theme')
    } catch {
      return null
    }
  }

  #store(theme) {
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // ignore
    }
  }
}
