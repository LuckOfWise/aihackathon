import { Controller } from '@hotwired/stimulus'
import type { Intensity } from '../types/face'

export default class extends Controller {
  static targets = ['option']
  static values = { selected: String }

  declare optionTargets: HTMLElement[]
  declare selectedValue: string

  connect(): void {
    this.updateActiveState()
  }

  select(event: Event): void {
    const target = event.currentTarget as HTMLElement
    const intensity = target.dataset.intensity as Intensity
    if (!intensity) return

    this.selectedValue = intensity
    this.updateActiveState()

    this.dispatch('change', { detail: { intensity } })
  }

  selectedValueChanged(): void {
    this.updateActiveState()
  }

  private updateActiveState(): void {
    for (const option of this.optionTargets) {
      const isSelected = option.dataset.intensity === this.selectedValue
      option.classList.toggle('is-active', isSelected)
      option.setAttribute('aria-pressed', String(isSelected))
    }
  }
}
