import { Controller } from '@hotwired/stimulus'
import { resizeToBase64 } from '../lib/image_resize'
import { detectFaceFromDataUrl } from '../lib/face_landmarker'
import type { FaceData, Point } from '../types/face'

export default class extends Controller {
  static targets = ['fileInput', 'canvas', 'status', 'result', 'json']

  declare fileInputTarget: HTMLInputElement
  declare canvasTarget: HTMLCanvasElement
  declare statusTarget: HTMLElement
  declare resultTarget: HTMLElement
  declare jsonTarget: HTMLElement

  async onFileChange(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    this.setStatus('検出中… (初回はモデルをダウンロードするため数秒かかります)')
    this.resultTarget.setAttribute('hidden', '')

    try {
      const dataUrl = await resizeToBase64(file)
      const detection = await detectFaceFromDataUrl(dataUrl)
      const img = await this.loadImage(dataUrl)

      this.drawOverlay(img, detection.face)
      this.jsonTarget.textContent = JSON.stringify(
        { imageSize: detection.imageSize, face: detection.face },
        null,
        2,
      )
      this.resultTarget.removeAttribute('hidden')

      if (detection.face) {
        this.setStatus(
          `検出成功 · 眼状態: L=${detection.face.eyes.left.state} / R=${detection.face.eyes.right.state} · 口: ${detection.face.mouth.state}`,
        )
      } else {
        this.setStatus('顔は検出されませんでした。', 'error')
      }
    } catch (err) {
      this.setStatus(err instanceof Error ? `エラー: ${err.message}` : 'エラーが発生しました', 'error')
    }
  }

  private setStatus(text: string, variant: 'info' | 'error' = 'info'): void {
    this.statusTarget.textContent = text
    this.statusTarget.dataset.variant = variant
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
      img.src = src
    })
  }

  private drawOverlay(img: HTMLImageElement, face: FaceData | null): void {
    const canvas = this.canvasTarget
    const w = img.naturalWidth
    const h = img.naturalHeight
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0)

    if (!face) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.85)'
      ctx.fillRect(0, 0, w, 40)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 18px sans-serif'
      ctx.fillText('顔が検出されませんでした', 12, 26)
      return
    }

    // face bbox (green)
    ctx.strokeStyle = '#16a34a'
    ctx.lineWidth = Math.max(2, Math.round(w / 400))
    ctx.strokeRect(face.bounding_box.x * w, face.bounding_box.y * h, face.bounding_box.w * w, face.bounding_box.h * h)

    // eyes: polygon (red) + iris circle (blue)
    for (const eye of [face.eyes.left, face.eyes.right]) {
      this.drawPolygon(ctx, eye.eye_polygon, w, h, '#ef4444', Math.max(1.5, w / 600))

      const cx = eye.iris_center.x * w
      const cy = eye.iris_center.y * h
      const radius = eye.iris_radius * Math.min(w, h)

      // iris ring
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = Math.max(1.5, w / 600)
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()

      // iris center dot
      ctx.fillStyle = '#2563eb'
      ctx.beginPath()
      ctx.arc(cx, cy, Math.max(2, w / 400), 0, Math.PI * 2)
      ctx.fill()

      this.drawLabel(ctx, cx, cy - radius - 6, eye.state, '#2563eb', w)
    }

    // teeth polygon (yellow) if mouth open
    if (face.mouth.teeth_polygon) {
      this.drawPolygon(ctx, face.mouth.teeth_polygon, w, h, '#eab308', Math.max(1.5, w / 600))
    }

    // mouth state label
    const mouthCenter = this.polygonCenter(
      face.mouth.teeth_polygon ?? [
        { x: face.bounding_box.x + face.bounding_box.w / 2, y: face.bounding_box.y + face.bounding_box.h * 0.82 },
      ],
    )
    this.drawLabel(ctx, mouthCenter.x * w, mouthCenter.y * h, face.mouth.state, '#eab308', w)
  }

  private drawPolygon(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    imgW: number,
    imgH: number,
    color: string,
    lineWidth: number,
  ): void {
    if (points.length < 2) return
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(points[0].x * imgW, points[0].y * imgH)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * imgW, points[i].y * imgH)
    }
    ctx.closePath()
    ctx.stroke()
  }

  private drawLabel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    text: string,
    color: string,
    imgW: number,
  ): void {
    const fontPx = Math.max(11, Math.round(imgW / 60))
    ctx.font = `bold ${fontPx}px ui-monospace, monospace`
    const padding = 4
    const textWidth = ctx.measureText(text).width
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(x, y - fontPx, textWidth + padding * 2, fontPx + padding)
    ctx.fillStyle = color
    ctx.fillText(text, x + padding, y - padding)
  }

  private polygonCenter(points: Point[]): Point {
    if (points.length === 0) return { x: 0.5, y: 0.5 }
    return {
      x: points.reduce((s, p) => s + p.x, 0) / points.length,
      y: points.reduce((s, p) => s + p.y, 0) / points.length,
    }
  }
}
