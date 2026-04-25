import type { FaceData, Intensity, Point } from '../types/face'

interface EffectParams {
  catchlightOpacity: number
  catchlightRadiusFactor: number
  saturationBoost: number
  brightnessDelta: number
  yellownessDelta: number
  sparkle: boolean
}

const EFFECT_PARAMS: Record<Intensity, EffectParams> = {
  subtle: {
    catchlightOpacity: 0.25,
    catchlightRadiusFactor: 0.30,
    saturationBoost: 0,
    brightnessDelta: 5,
    yellownessDelta: -3,
    sparkle: false,
  },
  standard: {
    catchlightOpacity: 0.50,
    catchlightRadiusFactor: 0.35,
    saturationBoost: 8,
    brightnessDelta: 10,
    yellownessDelta: -8,
    sparkle: false,
  },
  sparkle: {
    catchlightOpacity: 0.50,
    catchlightRadiusFactor: 0.35,
    saturationBoost: 8,
    brightnessDelta: 10,
    yellownessDelta: -8,
    sparkle: true,
  },
}

const MIN_POLYGON_AREA_RATIO = 0.001

function polygonArea(points: Point[]): number {
  let area = 0
  const n = points.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i].x * points[j].y
    area -= points[j].x * points[i].y
  }
  return Math.abs(area) / 2
}

function scalePoints(points: Point[], w: number, h: number): Point[] {
  return points.map(({ x, y }) => ({ x: x * w, y: y * h }))
}

function clipToPolygon(
  ctx: CanvasRenderingContext2D,
  points: Point[],
): void {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y)
  }
  ctx.closePath()
  ctx.clip()
}

function applyBrightnessYellowness(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  brightness: number,
  yellowness: number,
): void {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.floor(Math.min(...xs))
  const minY = Math.floor(Math.min(...ys))
  const maxX = Math.ceil(Math.max(...xs))
  const maxY = Math.ceil(Math.max(...ys))
  const w = maxX - minX
  const h = maxY - minY
  if (w <= 0 || h <= 0) return

  const imageData = ctx.getImageData(minX, minY, w, h)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] + brightness - yellowness)
    data[i + 1] = Math.min(255, data[i + 1] + brightness)
    data[i + 2] = Math.min(255, data[i + 2] + brightness + yellowness)
  }
  ctx.putImageData(imageData, minX, minY)
}

function applySaturation(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  saturationPercent: number,
): void {
  if (saturationPercent === 0) return
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = Math.floor(Math.min(...xs))
  const minY = Math.floor(Math.min(...ys))
  const maxX = Math.ceil(Math.max(...xs))
  const maxY = Math.ceil(Math.max(...ys))
  const w = maxX - minX
  const h = maxY - minY
  if (w <= 0 || h <= 0) return

  const imageData = ctx.getImageData(minX, minY, w, h)
  const data = imageData.data
  const factor = 1 + saturationPercent / 100
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    data[i] = Math.min(255, Math.max(0, gray + (r - gray) * factor))
    data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * factor))
    data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * factor))
  }
  ctx.putImageData(imageData, minX, minY)
}

function drawCatchlight(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  irisRadius: number,
  opacity: number,
  radiusFactor: number,
): void {
  const r = irisRadius * radiusFactor
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx + r * 0.3, cy - r * 0.3, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawSparkle(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const size = 16
  ctx.save()
  ctx.font = `${size}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✨', x, y)
  ctx.restore()
}

function processEye(
  ctx: CanvasRenderingContext2D,
  eye: { state: string; iris_center: Point; iris_radius: number; eye_polygon: Point[] },
  w: number,
  h: number,
  params: EffectParams,
): { cornerX: number; cornerY: number } | null {
  if (eye.state === 'closed') return null

  const polygon = scalePoints(eye.eye_polygon, w, h)
  const area = polygonArea(polygon)
  if (area / (w * h) < MIN_POLYGON_AREA_RATIO) return null

  const cx = eye.iris_center.x * w
  const cy = eye.iris_center.y * h
  const irisRadius = eye.iris_radius * Math.min(w, h)

  ctx.save()
  clipToPolygon(ctx, polygon)

  if (params.saturationBoost > 0) {
    applySaturation(ctx, polygon, params.saturationBoost)
  }

  drawCatchlight(ctx, cx, cy, irisRadius, params.catchlightOpacity, params.catchlightRadiusFactor)

  ctx.restore()

  const cornerX = Math.max(...polygon.map((p) => p.x))
  const cornerY = polygon.find((p) => p.x === cornerX)?.y ?? cy

  return { cornerX, cornerY }
}

function processTeeth(
  ctx: CanvasRenderingContext2D,
  mouth: { state: string; teeth_polygon: Point[] | null },
  w: number,
  h: number,
  params: EffectParams,
): { centerX: number; centerY: number } | null {
  if (mouth.state !== 'open_showing_teeth' || !mouth.teeth_polygon) return null

  const polygon = scalePoints(mouth.teeth_polygon, w, h)
  const area = polygonArea(polygon)
  if (area / (w * h) < MIN_POLYGON_AREA_RATIO) return null

  ctx.save()
  clipToPolygon(ctx, polygon)

  applyBrightnessYellowness(ctx, polygon, params.brightnessDelta, params.yellownessDelta)

  ctx.restore()

  const centerX = polygon.reduce((sum, p) => sum + p.x, 0) / polygon.length
  const centerY = polygon.reduce((sum, p) => sum + p.y, 0) / polygon.length

  return { centerX, centerY }
}

export function composeFaceEffect(
  sourceCanvas: HTMLCanvasElement,
  face: FaceData,
  intensity: Intensity,
): HTMLCanvasElement {
  const w = sourceCanvas.width
  const h = sourceCanvas.height

  const output = document.createElement('canvas')
  output.width = w
  output.height = h

  const ctx = output.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(sourceCanvas, 0, 0)

  const params = EFFECT_PARAMS[intensity]

  const leftCorner = processEye(ctx, face.eyes.left, w, h, params)
  const rightCorner = processEye(ctx, face.eyes.right, w, h, params)
  const teethCenter = processTeeth(ctx, face.mouth, w, h, params)

  if (params.sparkle) {
    if (leftCorner) drawSparkle(ctx, leftCorner.cornerX, leftCorner.cornerY)
    if (rightCorner) drawSparkle(ctx, rightCorner.cornerX, rightCorner.cornerY)
    if (teethCenter) drawSparkle(ctx, teethCenter.centerX, teethCenter.centerY)
  }

  return output
}

export async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      },
      'image/jpeg',
      0.92,
    )
  })
}

export function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')
  ctx.drawImage(img, 0, 0)
  return canvas
}
