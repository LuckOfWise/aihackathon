import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['before', 'divider', 'shimmer', 'labelBefore', 'labelAfter']

  declare beforeTarget: HTMLElement
  declare dividerTarget: HTMLElement
  declare shimmerTarget: HTMLElement
  declare labelBeforeTarget: HTMLElement
  declare labelAfterTarget: HTMLElement

  private pos = 60
  private dragging = false
  private boundPointerMove: ((e: Event) => void) | null = null
  private boundPointerUp: (() => void) | null = null

  connect(): void {
    this.boundPointerMove = (e: Event) => this.onPointerMove(e as PointerEvent)
    this.boundPointerUp = () => this.onPointerUp()
    this.element.addEventListener('pointerdown', (e: Event) => this.onPointerDown(e as PointerEvent))
    this.applyPos(this.pos)
  }

  disconnect(): void {
    if (this.boundPointerMove) window.removeEventListener('pointermove', this.boundPointerMove)
    if (this.boundPointerUp) window.removeEventListener('pointerup', this.boundPointerUp)
    this.boundPointerMove = null
    this.boundPointerUp = null
  }

  private onPointerDown(e: PointerEvent): void {
    this.dragging = true
    this.updateFromClientX(e.clientX)
    if (this.boundPointerMove) window.addEventListener('pointermove', this.boundPointerMove)
    if (this.boundPointerUp) window.addEventListener('pointerup', this.boundPointerUp)
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.dragging) return
    this.updateFromClientX(e.clientX)
  }

  private onPointerUp(): void {
    this.dragging = false
    if (this.boundPointerMove) window.removeEventListener('pointermove', this.boundPointerMove)
    if (this.boundPointerUp) window.removeEventListener('pointerup', this.boundPointerUp)
    this.updateShimmer()
  }

  private updateFromClientX(clientX: number): void {
    const rect = this.element.getBoundingClientRect()
    const p = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    this.applyPos(p)
  }

  private applyPos(pos: number): void {
    this.pos = pos
    this.dividerTarget.style.left = `${pos}%`
    this.beforeTarget.style.clipPath = `inset(0 ${100 - pos}% 0 0)`

    const sliderWrap = this.element as HTMLElement
    sliderWrap.style.boxShadow = pos > 50
      ? '0 0 80px rgba(212,175,55,0.25)'
      : 'none'

    this.labelBeforeTarget.style.opacity = pos > 15 ? '1' : '0'
    this.labelAfterTarget.style.opacity = pos < 85 ? '1' : '0'

    const shimmerLeft = pos - 30
    this.shimmerTarget.style.left = `${shimmerLeft}%`
    this.updateShimmer()
  }

  private updateShimmer(): void {
    const visible = this.dragging || this.pos > 40
    this.shimmerTarget.style.opacity = visible ? '1' : '0'
  }
}
