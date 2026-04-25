import { Controller } from '@hotwired/stimulus'
import type { LandmarksResponse, Point } from '../types/face'

export default class extends Controller {
  static targets = ['canvas', 'source']
  static values = { landmarks: Object }

  declare canvasTarget: HTMLCanvasElement
  declare sourceTarget: HTMLImageElement
  declare landmarksValue: LandmarksResponse

  connect(): void {
    if (this.sourceTarget.complete) {
      this.draw()
    } else {
      this.sourceTarget.addEventListener('load', () => this.draw(), { once: true })
    }
  }

  disconnect(): void {
    // no cleanup needed
  }

  private draw(): void {
    const img = this.sourceTarget
    const canvas = this.canvasTarget
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0)

    const { face } = this.landmarksValue
    if (!face) {
      ctx.fillStyle = 'rgba(220, 38, 38, 0.8)'
      ctx.font = '20px sans-serif'
      ctx.fillText('顔が検出されませんでした', 20, 40)
      return
    }

    const w = canvas.width
    const h = canvas.height

    this.drawBbox(ctx, face.bounding_box, w, h)

    for (const eye of [face.eyes.left, face.eyes.right]) {
      this.drawPolygon(ctx, eye.eye_polygon, w, h, '#ef4444')
      this.drawCircle(ctx, eye.iris_center, w, h, '#2563eb', eye.iris_radius * Math.min(w, h) * 0.5)
      this.drawLabel(ctx, eye.iris_center, w, h, eye.state)
    }

    if (face.mouth.teeth_polygon) {
      this.drawPolygon(ctx, face.mouth.teeth_polygon, w, h, '#eab308')
    }
    this.drawLabel(ctx, this.polygonCenter(face.mouth.teeth_polygon ?? [
      { x: face.bounding_box.x + face.bounding_box.w / 2, y: face.bounding_box.y + face.bounding_box.h * 0.8 },
    ]), w, h, face.mouth.state)

    const confLabel = `conf: ${(face.confidence * 100).toFixed(0)}%`
    ctx.fillStyle = face.confidence >= 0.7 ? '#16a34a' : '#d97706'
    ctx.font = 'bold 14px monospace'
    ctx.fillText(confLabel, face.bounding_box.x * w + 4, face.bounding_box.y * h - 6)
  }

  private drawBbox(
    ctx: CanvasRenderingContext2D,
    bbox: { x: number; y: number; w: number; h: number },
    imgW: number,
    imgH: number,
  ): void {
    ctx.strokeStyle = '#16a34a'
    ctx.lineWidth = 2
    ctx.strokeRect(bbox.x * imgW, bbox.y * imgH, bbox.w * imgW, bbox.h * imgH)
  }

  private drawPolygon(
    ctx: CanvasRenderingContext2D,
    points: Point[],
    imgW: number,
    imgH: number,
    color: string,
  ): void {
    if (points.length < 2) return
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(points[0].x * imgW, points[0].y * imgH)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x * imgW, points[i].y * imgH)
    }
    ctx.closePath()
    ctx.stroke()
  }

  private drawCircle(
    ctx: CanvasRenderingContext2D,
    center: Point,
    imgW: number,
    imgH: number,
    color: string,
    radius: number,
  ): void {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(center.x * imgW, center.y * imgH, Math.max(3, radius), 0, Math.PI * 2)
    ctx.fill()
  }

  private drawLabel(
    ctx: CanvasRenderingContext2D,
    point: Point,
    imgW: number,
    imgH: number,
    text: string,
  ): void {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(point.x * imgW, point.y * imgH - 14, text.length * 7, 16)
    ctx.fillStyle = '#ffffff'
    ctx.font = '11px monospace'
    ctx.fillText(text, point.x * imgW + 2, point.y * imgH)
  }

  private polygonCenter(points: Point[]): Point {
    if (points.length === 0) return { x: 0.5, y: 0.5 }
    return {
      x: points.reduce((s, p) => s + p.x, 0) / points.length,
      y: points.reduce((s, p) => s + p.y, 0) / points.length,
    }
  }
}
