import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = { text: String }

  async write() {
    try {
      await navigator.clipboard.writeText(this.textValue)
      this.element.classList.add('is-copied')
      setTimeout(() => this.element.classList.remove('is-copied'), 1200)
    } catch (e) {
      console.error('copy failed', e)
    }
  }
}
