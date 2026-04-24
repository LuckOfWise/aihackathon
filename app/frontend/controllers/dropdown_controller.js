import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['menu']

  connect() {
    this.boundClickOutside = this.clickOutside.bind(this)
    this.boundKeydown = this.keydown.bind(this)
  }

  disconnect() {
    document.removeEventListener('click', this.boundClickOutside)
    document.removeEventListener('keydown', this.boundKeydown)
  }

  toggle(event) {
    event.stopPropagation()
    const hidden = this.menuTarget.hasAttribute('hidden')
    if (hidden) {
      this.open()
    } else {
      this.close()
    }
  }

  open() {
    this.menuTarget.removeAttribute('hidden')
    this.element.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'true')
    document.addEventListener('click', this.boundClickOutside)
    document.addEventListener('keydown', this.boundKeydown)
  }

  close() {
    this.menuTarget.setAttribute('hidden', '')
    this.element.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false')
    document.removeEventListener('click', this.boundClickOutside)
    document.removeEventListener('keydown', this.boundKeydown)
  }

  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  keydown(event) {
    if (event.key === 'Escape') {
      this.close()
    }
  }
}
