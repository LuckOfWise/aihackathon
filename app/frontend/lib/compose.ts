import type { FaceData, Intensity, Point } from '../types/face'

interface EffectParams {
  catchlightOpacity: number
  catchlightRadiusFactor: number
  eyeFilter: string
  teethFilter: string
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
    catchlightOpacity: 0.35,
    catchlightRadiusFactor: 0.32,
    eyeFilter: 'brightness(1.04) saturate(1.08) contrast(1.02)',
    teethFilter: 'brightness(1.06) saturate(0.85) contrast(1.02)',
    rayOpacity: 0,
    rayLengthFactor: 0,
    haloOpacity: 0,
    haloRadiusFactor: 0,
    teethHighlightOpacity: 0.10,
    sparkle: false,
    sparkleCount: 0,
  },
  standard: {
    catchlightOpacity: 0.55,
    catchlightRadiusFactor: 0.42,
    eyeFilter: 'brightness(1.08) saturate(1.18) contrast(1.05)',
    teethFilter: 'brightness(1.10) saturate(0.72) contrast(1.03)',
    rayOpacity: 0,
    rayLengthFactor: 0,
    haloOpacity: 0,
    haloRadiusFactor: 0,
    teethHighlightOpacity: 0.18,
    sparkle: false,
    sparkleCount: 0,
  },
  sparkle: {
    catchlightOpacity: 1.0,
    catchlightRadiusFactor: 0.85,
    eyeFilter: 'brightness(1.45) saturate(1.95) contrast(1.25)',
    teethFilter: 'brightness(1.26) saturate(0.42) contrast(1.08)',
    rayOpacity: 0.95,
    rayLengthFactor: 3.4,
    haloOpacity: 0.65,
    haloRadiusFactor: 2.6,
    teethHighlightOpacity: 0.55,
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

const FEATHER_PX = 3

// 元画像のテクスチャを保ちつつ明るさ/彩度/コントラストだけ持ち上げるために、
// ポリゴン範囲を一度オフスクリーンに複写し、CSS filter で色補正したあと
// ぼかしたポリゴンマスクで destination-in 合成して本体に戻す。
// 各ピクセルを加算で飛ばす従来方式と違い、元のディテールが残るので
// 「ベタ塗り」感が出ない。
function applyFilterToRegion(
  ctx: CanvasRenderingContext2D,
  polygon: Point[],
  filterCss: string,
): void {
  if (!filterCss || filterCss === 'none') return

  const xs = polygon.map((p) => p.x)
  const ys = polygon.map((p) => p.y)
  const pad = FEATHER_PX + 2
  const minX = Math.max(0, Math.floor(Math.min(...xs)) - pad)
  const minY = Math.max(0, Math.floor(Math.min(...ys)) - pad)
  const maxX = Math.min(ctx.canvas.width, Math.ceil(Math.max(...xs)) + pad)
  const maxY = Math.min(ctx.canvas.height, Math.ceil(Math.max(...ys)) + pad)
  const w = maxX - minX
  const h = maxY - minY
  if (w <= 0 || h <= 0) return

  // 1) 元領域を offscreen へコピーしつつ filter で色補正
  const filtered = document.createElement('canvas')
  filtered.width = w
  filtered.height = h
  const fctx = filtered.getContext('2d')
  if (!fctx) return
  fctx.filter = filterCss
  fctx.drawImage(ctx.canvas, minX, minY, w, h, 0, 0, w, h)
  fctx.filter = 'none'

  // 2) マスクを作成（白塗りポリゴンにブラーでフェザー）
  const mask = document.createElement('canvas')
  mask.width = w
  mask.height = h
  const mctx = mask.getContext('2d')
  if (!mctx) return
  mctx.filter = `blur(${FEATHER_PX}px)`
  mctx.fillStyle = '#fff'
  mctx.beginPath()
  mctx.moveTo(polygon[0].x - minX, polygon[0].y - minY)
  for (let i = 1; i < polygon.length; i++) {
    mctx.lineTo(polygon[i].x - minX, polygon[i].y - minY)
  }
  mctx.closePath()
  mctx.fill()

  // 3) filtered をマスクで切り抜き
  fctx.globalCompositeOperation = 'destination-in'
  fctx.drawImage(mask, 0, 0)

  // 4) 本体に戻す（fillRect ではなく drawImage なので clip の影響は受けない）
  ctx.drawImage(filtered, minX, minY)
}

function drawIrisGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  irisRadius: number,
): void {
  // 虹彩全体を内側から発光させる柔らかい光。
  // screen blend で暗い虹彩を持ち上げ、明るい白目部分は飽和側でクリップされ自然に残る。
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, irisRadius)
  grad.addColorStop(0, 'rgba(255,250,220,0.85)')
  grad.addColorStop(0.55, 'rgba(255,240,200,0.55)')
  grad.addColorStop(1, 'rgba(255,235,180,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx, cy, irisRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
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
  // 1) メインのキャッチライト(右上寄せ・大)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = opacity
  const grad = ctx.createRadialGradient(cx + r * 0.25, cy - r * 0.3, 0, cx + r * 0.25, cy - r * 0.3, r)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.6, 'rgba(255,255,255,0.9)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(cx + r * 0.25, cy - r * 0.3, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 2) 真っ白な小さなコア(瞳の中心の鋭いハイライト)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.globalAlpha = Math.min(1, opacity + 0.05)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(cx + r * 0.25, cy - r * 0.3, r * 0.35, 0, Math.PI * 2)
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
  if (opacity <= 0 || lengthFactor <= 0) return
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
  if (opacity <= 0 || radiusFactor <= 0) return
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

  // 虹彩の色補正（元のテクスチャを保ちつつ brightness/saturate/contrast）
  applyFilterToRegion(ctx, polygon, params.eyeFilter)

  // キャッチライトを clip 内で合成。iris glow は sparkle 時のみ。
  ctx.save()
  clipToPolygon(ctx, polygon)
  if (params.sparkle) {
    drawIrisGlow(ctx, cx, cy, irisRadius)
  }
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

  // 歯の色補正（明るさ +, 彩度 -, 少しコントラスト —— 自然に白く見える）
  applyFilterToRegion(ctx, polygon, params.teethFilter)

  // うっすらハイライトのグラデーション（控えめに）
  ctx.save()
  clipToPolygon(ctx, polygon)
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
    if (teethCenter) {
      // 真ん中に置くと顔の対称軸と被って目立たないので、右寄せ + 少し上
      const offsetX = Math.min(w, h) * 0.04
      const offsetY = -Math.min(w, h) * 0.015
      seedPoints.push({
        x: teethCenter.centerX + offsetX,
        y: teethCenter.centerY + offsetY,
        size: Math.min(w, h) * 0.025,
      })
    }

    for (const p of seedPoints) {
      drawSparkleStar(ctx, p.x, p.y, p.size)
    }
    // Scatter extra sparkles around each eye toward the outer-upper arc only
    // (顔の外側 + 上方 120° 程度に寄せて非対称感を出す)
    const faceCenterX = w / 2
    const scatterEyes = [leftEye, rightEye].filter(Boolean) as NonNullable<typeof leftEye>[]
    for (const eye of scatterEyes) {
      const isOuterRight = eye.cx >= faceCenterX
      // Canvas は Y-down。上方=sin<0。外側右 -> cos>0、外側左 -> cos<0。
      // base 角度を外側・上方に向け、±60° の扇型に ばらす。
      const baseAngle = isOuterRight ? -Math.PI / 4 : -Math.PI * 3 / 4
      const arcSpan = Math.PI * 2 / 3  // 120°
      for (let i = 0; i < params.sparkleCount; i++) {
        const t = params.sparkleCount === 1 ? 0.5 : i / (params.sparkleCount - 1)
        const angle = baseAngle + (t - 0.5) * arcSpan
        const dist = eye.irisRadius * (1.6 + (i % 3) * 0.5)
        const size = eye.irisRadius * (0.28 + (i % 2) * 0.18)
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
