import { Controller } from '@hotwired/stimulus'
import { composeFaceEffect, canvasToBlob } from '../lib/compose'
import type { FaceData, Intensity } from '../types/face'

export default class extends Controller<HTMLCanvasElement> {
  static values = {
    intensity: String,
  }

  declare intensityValue: Intensity

  private sourceCanvas: HTMLCanvasElement | null = null
  private faceData: FaceData | null = null

  disconnect(): void {
    this.sourceCanvas = null
    this.faceData = null
  }

  setSource(canvas: HTMLCanvasElement): void {
    this.sourceCanvas = canvas
    this.render()
  }

  setFaceData(face: FaceData): void {
    this.faceData = face
    this.render()
  }

  intensityValueChanged(): void {
    this.render()
  }

  async getOutputBlob(): Promise<Blob | null> {
    const ctx = this.element.getContext('2d')
    if (!ctx || !this.sourceCanvas || !this.faceData) return null
    return canvasToBlob(this.element)
  }

  private render(): void {
    if (!this.sourceCanvas || !this.faceData) return

    try {
      const result = composeFaceEffect(this.sourceCanvas, this.faceData, this.intensityValue)
      const ctx = this.element.getContext('2d')
      if (!ctx) return

      this.element.width = result.width
      this.element.height = result.height
      ctx.drawImage(result, 0, 0)
    } catch (err) {
      console.error('Compose error:', err)
    }
  }
}
