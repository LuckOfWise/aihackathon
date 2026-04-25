import type { FaceData, Intensity, Point } from '../types/face'

interface EffectParams {
  catchlightOpacity: number
  catchlightRadiusFactor: number
  saturationBoost: number
  brightnessDelta: number
  yellownessDelta: number
  rayOpacity: number
  rayLengthFactor: number
  haloOpacity: number
  haloRadiusFactor: number
  teethHighlightOpacity: number
  sparkle: boolean
  sparkleCount: number
}

const EFFECT_PARAMS: Record<Intensity, EffectParams> = {
  subtle: {
    catchlightOpacity: 0.6,
    catchlightRadiusFactor: 0.45,
    saturationBoost: 18,
    brightnessDelta: 15,
    yellownessDelta: -10,
    rayOpacity: 0.35,
    rayLengthFactor: 1.6,
    haloOpacity: 0.18,
    haloRadiusFactor: 1.5,
    teethHighlightOpacity: 0.25,
    sparkle: false,
    sparkleCount: 0,
  },
  standard: {
    catchlightOpacity: 0.9,
    catchlightRadiusFactor: 0.55,
    saturationBoost: 40,
    brightnessDelta: 28,
    yellownessDelta: -22,
    rayOpacity: 0.7,
    rayLengthFactor: 2.6,
    haloOpacity: 0.35,
    haloRadiusFactor: 2.0,
    teethHighlightOpacity: 0.55,
    sparkle: false,
    sparkleCount: 0,
  },
  sparkle: {
    catchlightOpacity: 1.0,
    catchlightRadiusFactor: 0.65,
    saturationBoost: 60,
    brightnessDelta: 40,
    yellownessDelta: -30,
    rayOpacity: 0.95,
    rayLengthFactor: 3.4,
    haloOpacity: 0.55,
    haloRadiusFactor: 2.6,
    teethHighlightOpacity: 0.75,
    sparkle: true,
    sparkleCount: 6,
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

const FEATHER_PX = 2

// putImageData は ctx.clip() を無視するため、ポリゴン内かどうかを自前で判定する。
// エッジ付近は FEATHER_PX で滑らかにフェードさせ、矩形っぽい境界を消す。
function pointInPolygon(x: number, y: number, polygon: Point[]): boolean {
  let inside = false
  const n = polygon.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x
    const yi = polygon[i].y
    const xj = polygon[j].x
    const yj = polygon[j].y
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

function pointToSegmentDistance(
  px: number, py: number,
  ax: number, ay: number,
  bx: number, by: number,
): number {
  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

function distanceToPolygonEdge(x: number, y: number, polygon: Point[]): number {
  let minDist = Infinity
  const n = polygon.length
  for (let i = 0; i < n; i++) {
    const a = polygon[i]
    const b = polygon[(i + 1) % n]
    const d = pointToSegmentDistance(x, y, a.x, a.y, b.x, b.y)
    if (d < minDist) minDist = d
  }
  return minDist
}

function applyBrightnessYellowness(
  ctx: CanvasRenderingContext2D,
  polygon: Point[],
  brightness: number,
  yellowness: number,
): void {
  const xs = polygon.map((p) => p.x)
  const ys = polygon.map((p) => p.y)
  const minX = Math.floor(Math.min(...xs))
  const minY = Math.floor(Math.min(...ys))
  const maxX = Math.ceil(Math.max(...xs))
  const maxY = Math.ceil(Math.max(...ys))
  const w = maxX - minX
  const h = maxY - minY
  if (w <= 0 || h <= 0) return

  const imageData = ctx.getImageData(minX, minY, w, h)
  const data = imageData.data
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const gx = minX + px + 0.5
      const gy = minY + py + 0.5
      if (!pointInPolygon(gx, gy, polygon)) continue
      const edge = distanceToPolygonEdge(gx, gy, polygon)
      const k = Math.min(1, edge / FEATHER_PX)
      const i = (py * w + px) * 4
      data[i] = Math.min(255, data[i] + (brightness - yellowness) * k)
      data[i + 1] = Math.min(255, data[i + 1] + brightness * k)
      data[i + 2] = Math.min(255, data[i + 2] + (brightness + yellowness) * k)
    }
  }
  ctx.putImageData(imageData, minX, minY)
}

function applySaturation(
  ctx: CanvasRenderingContext2D,
  polygon: Point[],
  saturationPercent: number,
): void {
  if (saturationPercent === 0) return
  const xs = polygon.map((p) => p.x)
  const ys = polygon.map((p) => p.y)
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
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const gx = minX + px + 0.5
      const gy = minY + py + 0.5
      if (!pointInPolygon(gx, gy, polygon)) continue
      const edge = distanceToPolygonEdge(gx, gy, polygon)
      const k = Math.min(1, edge / FEATHER_PX)
      const i = (py * w + px) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      const nr = Math.min(255, Math.max(0, gray + (r - gray) * factor))
      const ng = Math.min(255, Math.max(0, gray + (g - gray) * factor))
      const nb = Math.min(255, Math.max(0, gray + (b - gray) * factor))
      data[i] = r + (nr - r) * k
      data[i + 1] = g + (ng - g) * k
      data[i + 2] = b + (nb - b) * k
    }
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
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opacity
  const grad = ctx.createRadialGradient(cx + r * 0.2, cy - r * 0.2, 0, cx + r * 0.2, cy - r * 0.2, r)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.7, 'rgba(255,255,255,0.85)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx + r * 0.2, cy - r * 0.2, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawStarRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  irisRadius: number,
  opacity: number,
  lengthFactor: number,
): void {
  const long = irisRadius * lengthFactor
  const short = irisRadius * 0.22
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opacity
  // 4-pointed star (horizontal + vertical arms)
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, long)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,245,200,0.9)')
  grad.addColorStop(1, 'rgba(255,245,200,0)')
  ctx.fillStyle = grad
  // Horizontal arm
  ctx.beginPath()
  ctx.moveTo(cx - long, cy)
  ctx.lineTo(cx, cy - short)
  ctx.lineTo(cx + long, cy)
  ctx.lineTo(cx, cy + short)
  ctx.closePath()
  ctx.fill()
  // Vertical arm
  ctx.beginPath()
  ctx.moveTo(cx, cy - long)
  ctx.lineTo(cx - short, cy)
  ctx.lineTo(cx, cy + long)
  ctx.lineTo(cx + short, cy)
  ctx.closePath()
  ctx.fill()
  // Diagonal arms (shorter)
  const diag = long * 0.6
  const sh = short * 0.6
  ctx.beginPath()
  ctx.moveTo(cx - diag, cy - diag)
  ctx.lineTo(cx - sh, cy + sh)
  ctx.lineTo(cx + diag, cy + diag)
  ctx.lineTo(cx + sh, cy - sh)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawEyeHalo(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  irisRadius: number,
  opacity: number,
  radiusFactor: number,
): void {
  const r = irisRadius * radiusFactor
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opacity
  const grad = ctx.createRadialGradient(cx, cy, irisRadius * 0.3, cx, cy, r)
  grad.addColorStop(0, 'rgba(255,240,180,0.9)')
  grad.addColorStop(0.5, 'rgba(255,220,140,0.35)')
  grad.addColorStop(1, 'rgba(255,220,140,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawTeethHighlight(
  ctx: CanvasRenderingContext2D,
  polygon: Point[],
  opacity: number,
): void {
  const xs = polygon.map((p) => p.x)
  const ys = polygon.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opacity
  const grad = ctx.createLinearGradient(0, minY, 0, maxY)
  grad.addColorStop(0, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.35)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(minX, minY, maxX - minX, maxY - minY)
  ctx.restore()
}

function drawSparkleStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = '#ffffff'
  const outer = size
  const inner = size * 0.35
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i
    const r = i % 2 === 0 ? outer : inner
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function processEye(
  ctx: CanvasRenderingContext2D,
  eye: { state: string; iris_center: Point; iris_radius: number; eye_polygon: Point[] },
  w: number,
  h: number,
  params: EffectParams,
): { cx: number; cy: number; irisRadius: number; cornerX: number; cornerY: number } | null {
  if (eye.state === 'closed') return null

  const polygon = scalePoints(eye.eye_polygon, w, h)
  const area = polygonArea(polygon)
  if (area / (w * h) < MIN_POLYGON_AREA_RATIO) return null

  const cx = eye.iris_center.x * w
  const cy = eye.iris_center.y * h
  const irisRadius = eye.iris_radius * Math.min(w, h)

  // Clip to eye polygon for inside-eye effects
  ctx.save()
  clipToPolygon(ctx, polygon)
  if (params.saturationBoost > 0) {
    applySaturation(ctx, polygon, params.saturationBoost)
  }
  applyBrightnessYellowness(ctx, polygon, params.brightnessDelta * 0.6, 0)
  drawCatchlight(ctx, cx, cy, irisRadius, params.catchlightOpacity, params.catchlightRadiusFactor)
  ctx.restore()

  const cornerX = Math.max(...polygon.map((p) => p.x))
  const cornerY = polygon.find((p) => p.x === cornerX)?.y ?? cy

  return { cx, cy, irisRadius, cornerX, cornerY }
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
  // saturate toward white by desaturating + brightening
  if (params.saturationBoost > 0) {
    applySaturation(ctx, polygon, -params.saturationBoost * 0.8)
  }
  drawTeethHighlight(ctx, polygon, params.teethHighlightOpacity)
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

  const leftEye = processEye(ctx, face.eyes.left, w, h, params)
  const rightEye = processEye(ctx, face.eyes.right, w, h, params)
  const teethCenter = processTeeth(ctx, face.mouth, w, h, params)

  // Halo + star rays drawn OUTSIDE the eye-polygon clip so they bleed around the eye
  for (const eye of [leftEye, rightEye]) {
    if (!eye) continue
    drawEyeHalo(ctx, eye.cx, eye.cy, eye.irisRadius, params.haloOpacity, params.haloRadiusFactor)
    drawStarRays(ctx, eye.cx, eye.cy, eye.irisRadius, params.rayOpacity, params.rayLengthFactor)
  }

  if (params.sparkle) {
    const seedPoints: { x: number; y: number; size: number }[] = []
    if (leftEye) seedPoints.push({ x: leftEye.cornerX, y: leftEye.cornerY, size: leftEye.irisRadius * 0.9 })
    if (rightEye) seedPoints.push({ x: rightEye.cornerX, y: rightEye.cornerY, size: rightEye.irisRadius * 0.9 })
    if (teethCenter) seedPoints.push({ x: teethCenter.centerX, y: teethCenter.centerY, size: Math.min(w, h) * 0.02 })

    for (const p of seedPoints) {
      drawSparkleStar(ctx, p.x, p.y, p.size)
    }
    // Scatter extra sparkles around each eye
    const scatterEyes = [leftEye, rightEye].filter(Boolean) as NonNullable<typeof leftEye>[]
    for (const eye of scatterEyes) {
      for (let i = 0; i < params.sparkleCount; i++) {
        const angle = (i / params.sparkleCount) * Math.PI * 2 + 0.3
        const dist = eye.irisRadius * (1.8 + (i % 3) * 0.4)
        const size = eye.irisRadius * (0.25 + (i % 2) * 0.15)
        drawSparkleStar(ctx, eye.cx + Math.cos(angle) * dist, eye.cy + Math.sin(angle) * dist, size)
      }
    }
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
