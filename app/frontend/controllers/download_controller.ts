import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['canvas']
  static values = { filename: String }

  declare canvasTarget: HTMLCanvasElement
  declare filenameValue: string

  disconnect(): void {
    // no cleanup needed
  }

  download(): void {
    const canvas = this.canvasTarget
    const filename = this.filenameValue || 'shined.jpg'

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      },
      'image/jpeg',
      0.92,
    )
  }
}
