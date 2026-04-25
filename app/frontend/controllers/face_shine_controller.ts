import { Controller } from '@hotwired/stimulus'
import { resizeToBase64, dataUrlToBlob } from '../lib/image_resize'
import { composeFaceEffect, composeFilterOnly, canvasToBlob, imageToCanvas } from '../lib/compose'
import { detectFaceFromDataUrl, preloadFaceLandmarker } from '../lib/face_landmarker'
import { postSse } from '../lib/sse_client'
import type { FaceData, Intensity, Point } from '../types/face'

type Stage = 'hero' | 'upload' | 'analyzing' | 'result' | 'verdict' | 'match'

const ANALYSIS_LOG = [
  '▸ Booting SHINE-MATE engine v0.9.3',
  '▸ KICKHOST core · context loaded (1024 tok)',
  '▸ Detecting face geometry…',
  '✓ Face detected · confidence 0.97',
  '▸ Generating 478-point FaceMesh',
  '✓ Topology built · 478 vertices · 956 edges',
  '▸ Locating IRIS_L · IRIS_R',
  '✓ IRIS_L ⟶ (134,172) · area 168px²',
  '✓ IRIS_R ⟶ (186,172) · area 172px²',
  '▸ Segmenting DENTITION region',
  '✓ Enamel mask · 48×20 · ΔL* +18.4',
  '▸ Computing SHINE_INDEX',
  '✓ Δ ATTRACT = +38.4 pt',
  '▸ Asking KICKHOST for editorial verdict…',
  '✓ Verdict received · "Quiet Radiance"',
  '✦ SHINE-MATE complete. Display.',
] as const

const MESH_POINTS: [number, number][] = [
  [88, 170], [90, 200], [96, 228], [108, 254], [124, 276], [144, 290], [160, 294],
  [176, 290], [196, 276], [212, 254], [224, 228], [230, 200], [232, 170],
  [98, 140], [120, 118], [148, 108], [160, 106], [172, 108], [200, 118], [222, 140],
  [114, 150], [124, 144], [134, 143], [144, 148],
  [176, 148], [186, 143], [196, 144], [206, 150],
  [120, 170], [128, 166], [134, 165], [140, 166], [148, 170], [140, 176], [134, 177], [128, 176],
  [172, 170], [180, 166], [186, 165], [192, 166], [200, 170], [192, 176], [186, 177], [180, 176],
  [160, 170], [160, 184], [160, 198], [152, 206], [160, 212], [168, 206],
  [138, 222], [148, 218], [160, 220], [172, 218], [182, 222], [174, 228], [160, 232], [146, 228],
]

const MESH_EDGES: [number, number][] = [
  ...(Array.from({ length: 12 }, (_, i) => [i, i + 1]) as [number, number][]),
  ...(Array.from({ length: 6 }, (_, i) => [i + 13, i + 14]) as [number, number][]),
  [0, 13], [12, 19],
  [20, 21], [21, 22], [22, 23], [24, 25], [25, 26], [26, 27],
  [28, 29], [29, 30], [30, 31], [31, 32], [32, 33], [33, 34], [34, 35], [35, 28],
  [36, 37], [37, 38], [38, 39], [39, 40], [40, 41], [41, 42], [42, 43], [43, 36],
  [44, 45], [45, 46], [46, 47], [46, 49], [47, 48], [48, 49],
  [50, 51], [51, 52], [52, 53], [53, 54], [54, 55], [55, 56], [56, 57], [57, 50],
  [13, 20], [19, 27], [20, 28], [27, 36], [44, 30], [44, 38], [46, 52], [50, 32], [54, 40],
]

const MAX_QUALITY_RETRIES = 2
const ANALYSIS_DURATION_MS = 12000

export default class extends Controller {
  static targets = [
    'stageHero', 'stageUpload', 'stageAnalyzing', 'stageResult', 'stageVerdict', 'stageMatch',
    'flashOverlay',
    'fileInput',
    'cameraOverlay', 'cameraVideo',
    'analyzingImg', 'overlaySvg', 'meshEdges', 'meshDots', 'bboxGroup', 'reticleGroup', 'tickGroup',
    'overlayLabels', 'scanLine', 'logPanel', 'progressFill', 'progressNum', 'progressBar',
    'resultCanvas', 'beforeImg', 'matchCanvas',
    'commentDisplay', 'scoreDisplay',
    'errorMessage',
    'metricEye', 'metricEnamel', 'metricAttract',
    'downloadButton',
    'copyButton', 'copyLabel',
  ]

  static values = {
    stage: String,
    intensity: String,
  }

  declare stageHeroTarget: HTMLElement
  declare stageUploadTarget: HTMLElement
  declare stageAnalyzingTarget: HTMLElement
  declare stageResultTarget: HTMLElement
  declare stageVerdictTarget: HTMLElement
  declare stageMatchTarget: HTMLElement
  declare flashOverlayTarget: HTMLElement
  declare fileInputTarget: HTMLInputElement
  declare hasFileInputTarget: boolean
  declare cameraOverlayTarget: HTMLElement
  declare cameraVideoTarget: HTMLVideoElement
  declare hasCameraVideoTarget: boolean
  declare analyzingImgTarget: HTMLImageElement
  declare overlaySvgTarget: SVGSVGElement
  declare meshEdgesTarget: SVGGElement
  declare meshDotsTarget: SVGGElement
  declare bboxGroupTarget: SVGGElement
  declare reticleGroupTarget: SVGGElement
  declare tickGroupTarget: SVGGElement
  declare overlayLabelsTarget: HTMLElement
  declare scanLineTarget: HTMLElement
  declare logPanelTarget: HTMLElement
  declare progressFillTarget: HTMLElement
  declare progressNumTarget: HTMLElement
  declare progressBarTarget: HTMLElement
  declare resultCanvasTarget: HTMLCanvasElement
  declare beforeImgTarget: HTMLImageElement
  declare matchCanvasTarget: HTMLCanvasElement
  declare commentDisplayTarget: HTMLElement
  declare scoreDisplayTarget: HTMLElement
  declare errorMessageTarget: HTMLElement
  declare metricEyeTarget: HTMLElement
  declare metricEnamelTarget: HTMLElement
  declare metricAttractTarget: HTMLElement
  declare downloadButtonTarget: HTMLButtonElement
  declare copyButtonTarget: HTMLButtonElement
  declare copyLabelTarget: HTMLElement
  declare hasCopyButtonTarget: boolean

  declare stageValue: Stage
  declare intensityValue: Intensity

  private originalDataUrl: string | null = null
  private faceData: FaceData | null = null
  private composedCanvas: HTMLCanvasElement | null = null
  private enhancedImageUrl: string | null = null
  private enhancedImagePromise: Promise<void> | null = null
  private abortController: AbortController | null = null
  private analysisRaf: number | null = null
  private qualityRetryCount = 0
  private cameraStream: MediaStream | null = null
  private metricRafs: number[] = []
  private currentMetrics = { eye: 0, enamel: 0, attract: 0 }
  private serverScore: number | null = null

  connect(): void {
    this.buildMeshSvg()
    this.buildTicksSvg()
    this.showStage('hero')
    preloadFaceLandmarker()
  }

  disconnect(): void {
    this.abortController?.abort()
    if (this.analysisRaf !== null) {
      cancelAnimationFrame(this.analysisRaf)
      this.analysisRaf = null
    }
    this.stopCameraStream()
  }

  gotoHero(): void { this.resetUploadState(); this.showStage('hero') }
  gotoUpload(): void { this.resetUploadState(); this.showStage('upload') }
  gotoAnalyzing(): void { this.showStage('analyzing') }
  gotoResult(): void { this.triggerFlash(); this.showStage('result') }
  gotoVerdict(): void { this.showStage('verdict') }
  gotoMatch(): void { this.showStage('match'); this.renderMatchCard() }

  async onFileChange(event: Event): Promise<void> {
    const input = event.currentTarget as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    await this.processImageFile(file)
  }

  async openCamera(): Promise<void> {
    this.clearError()
    if (!navigator.mediaDevices?.getUserMedia) {
      this.showError('このブラウザはカメラをサポートしていません')
      return
    }
    try {
      this.cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      })
      this.cameraVideoTarget.srcObject = this.cameraStream
      await this.cameraVideoTarget.play()
      this.cameraOverlayTarget.removeAttribute('hidden')
    } catch (err) {
      this.stopCameraStream()
      const msg = err instanceof Error && err.name === 'NotAllowedError'
        ? 'カメラの使用が許可されていません'
        : 'カメラを起動できませんでした'
      this.showError(msg)
    }
  }

  closeCamera(): void {
    this.stopCameraStream()
    this.cameraOverlayTarget.setAttribute('hidden', '')
  }

  async capturePhoto(): Promise<void> {
    const video = this.cameraVideoTarget
    if (!video.videoWidth || !video.videoHeight) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return
    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })

    this.closeCamera()
    await this.processImageFile(file)
  }

  private stopCameraStream(): void {
    this.cameraStream?.getTracks().forEach(t => t.stop())
    this.cameraStream = null
    if (this.hasCameraVideoTarget) {
      this.cameraVideoTarget.srcObject = null
    }
  }

  // 戻る系遷移時に呼ぶ。前回選んだファイルの value を消さないと
  // 同じファイルを再選択しても change イベントが発火しない。
  // 進行中の解析(animation / fetch)も中断してから新規受け付けに備える。
  private resetUploadState(): void {
    this.abortController?.abort()
    this.abortController = null
    if (this.analysisRaf !== null) {
      cancelAnimationFrame(this.analysisRaf)
      this.analysisRaf = null
    }
    for (const id of this.metricRafs) cancelAnimationFrame(id)
    this.metricRafs = []
    this.currentMetrics = { eye: 0, enamel: 0, attract: 0 }
    this.serverScore = null
    if (this.hasFileInputTarget) {
      this.fileInputTarget.value = ''
    }
    this.clearError()
  }

  private async processImageFile(file: File): Promise<void> {
    this.clearError()
    this.qualityRetryCount = 0

    try {
      this.originalDataUrl = await resizeToBase64(file)
      this.showStage('analyzing')
      this.startAnalysisAnimation()
      await this.analyze()
    } catch (err) {
      this.showError(err instanceof Error ? err.message : '画像の読み込みに失敗しました')
      this.showStage('upload')
    }
  }

  async onIntensityChange(event: Event): Promise<void> {
    const detail = (event as CustomEvent<{ intensity: Intensity }>).detail
    this.intensityValue = detail.intensity
    if (!this.faceData || !this.originalDataUrl) return

    // overdo （やりすぎる）に切り替わって Replicate 結果がまだ届いていなければ
    // analyzing 画面を再利用して待ち時間を埋める（裏で fetch は走り続けている）。
    if (this.intensityValue === 'overdo' && !this.enhancedImageUrl) {
      this.showStage('analyzing')
      this.startAnalysisAnimation()
      if (this.enhancedImagePromise) {
        await this.enhancedImagePromise
      }
      await this.waitForAnimationEnd()
    }

    await this.recompose()
  }

  private async waitForAnimationEnd(): Promise<void> {
    return new Promise((resolve) => {
      const check = (): void => {
        if (this.analysisRaf === null) resolve()
        else setTimeout(check, 200)
      }
      setTimeout(check, 200)
    })
  }

  async download(): Promise<void> {
    if (!this.composedCanvas) return
    const blob = await canvasToBlob(this.composedCanvas)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shine-mate-photo.jpg'
    a.click()
    URL.revokeObjectURL(url)
  }

  async copyComment(): Promise<void> {
    const text = this.commentDisplayTarget.textContent?.trim()
    if (!text || !this.hasCopyButtonTarget) return

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }

    this.copyButtonTarget.classList.add('is-copied')
    this.copyLabelTarget.textContent = 'コピーしました'
    setTimeout(() => {
      if (!this.hasCopyButtonTarget) return
      this.copyButtonTarget.classList.remove('is-copied')
      this.copyLabelTarget.textContent = 'コピー'
    }, 1800)
  }

  private showStage(stage: Stage): void {
    const stageMap: Record<Stage, HTMLElement> = {
      hero: this.stageHeroTarget,
      upload: this.stageUploadTarget,
      analyzing: this.stageAnalyzingTarget,
      result: this.stageResultTarget,
      verdict: this.stageVerdictTarget,
      match: this.stageMatchTarget,
    }

    for (const [name, el] of Object.entries(stageMap)) {
      if (name === stage) {
        el.removeAttribute('hidden')
      } else {
        el.setAttribute('hidden', '')
      }
    }

    this.stageValue = stage
  }

  private triggerFlash(): void {
    const el = this.flashOverlayTarget
    el.classList.remove('is-active')
    void el.offsetWidth
    el.classList.add('is-active')
    setTimeout(() => el.classList.remove('is-active'), 900)
  }

  private startAnalysisAnimation(): void {
    if (this.analysisRaf !== null) {
      cancelAnimationFrame(this.analysisRaf)
      this.analysisRaf = null
    }

    this.logPanelTarget.innerHTML = ''

    if (this.originalDataUrl) {
      this.analyzingImgTarget.src = this.originalDataUrl
    }

    const start = performance.now()
    let logIdx = 0

    const tick = (now: number): void => {
      const progress = Math.min(1, (now - start) / ANALYSIS_DURATION_MS)
      this.updateProgress(progress)
      this.updateScanLine(progress)
      this.updateOverlayOpacity(progress)

      const targetLog = Math.min(ANALYSIS_LOG.length, Math.floor(progress * ANALYSIS_LOG.length) + 1)
      while (logIdx < targetLog) {
        this.appendLog(ANALYSIS_LOG[logIdx], logIdx === targetLog - 1)
        logIdx++
      }

      if (progress < 1) {
        this.analysisRaf = requestAnimationFrame(tick)
      } else {
        this.analysisRaf = null
        this.scanLineTarget.style.display = 'none'
      }
    }

    this.scanLineTarget.style.display = ''
    this.analysisRaf = requestAnimationFrame(tick)
  }

  private updateProgress(progress: number): void {
    const pct = Math.round(progress * 100)
    this.progressFillTarget.style.width = `${pct}%`
    this.progressNumTarget.textContent = String(pct).padStart(2, '0')
    this.progressBarTarget.setAttribute('aria-valuenow', String(pct))
  }

  private updateScanLine(progress: number): void {
    this.scanLineTarget.style.top = `${progress * 100}%`
  }

  private updateOverlayOpacity(progress: number): void {
    const meshOpacity = Math.min(1, Math.max(0, (progress - 0.05) / 0.35))
    const boxOpacity = Math.min(1, Math.max(0, (progress - 0.35) / 0.25))
    const labelOpacity = Math.min(1, Math.max(0, (progress - 0.55) / 0.25))

    this.meshEdgesTarget.setAttribute('opacity', String(meshOpacity))
    this.meshDotsTarget.setAttribute('opacity', String(meshOpacity))
    this.tickGroupTarget.setAttribute('opacity', String(meshOpacity * 0.6))
    this.bboxGroupTarget.setAttribute('opacity', String(boxOpacity))
    this.reticleGroupTarget.setAttribute('opacity', String(boxOpacity * 0.8))
    this.overlayLabelsTarget.style.opacity = String(labelOpacity)
  }

  private appendLog(line: string, isLatest: boolean): void {
    const panel = this.logPanelTarget
    const div = document.createElement('div')
    div.className = 'shine-analyzing__log-line'
    if (isLatest) div.classList.add('is-latest')
    if (line.startsWith('✓')) div.classList.add('is-gold')
    else if (line.startsWith('▸')) div.classList.add('is-ai')

    const ts = document.createElement('span')
    ts.className = 'shine-analyzing__log-ts'
    const logIdx = panel.children.length
    const sec = Math.floor(logIdx * 0.5)
    const ms = (logIdx * 173) % 99
    ts.textContent = `[${String(sec).padStart(2, '0')}.${String(ms).padStart(2, '0')}]`

    div.appendChild(ts)
    div.appendChild(document.createTextNode(line))
    panel.appendChild(div)

    if (panel.children.length > 6) {
      panel.children[0].remove()
    }
  }

  private buildMeshSvg(): void {
    const NS = 'http://www.w3.org/2000/svg'

    for (const [a, b] of MESH_EDGES) {
      const p1 = MESH_POINTS[a]
      const p2 = MESH_POINTS[b]
      if (!p1 || !p2) continue
      const line = document.createElementNS(NS, 'line')
      line.setAttribute('x1', String(p1[0]))
      line.setAttribute('y1', String(p1[1]))
      line.setAttribute('x2', String(p2[0]))
      line.setAttribute('y2', String(p2[1]))
      line.setAttribute('stroke', '#00F2FF')
      line.setAttribute('stroke-width', '0.4')
      line.setAttribute('opacity', '0.7')
      this.meshEdgesTarget.appendChild(line)
    }

    for (const [cx, cy] of MESH_POINTS) {
      const circle = document.createElementNS(NS, 'circle')
      circle.setAttribute('cx', String(cx))
      circle.setAttribute('cy', String(cy))
      circle.setAttribute('r', '0.9')
      circle.setAttribute('fill', '#00F2FF')
      this.meshDotsTarget.appendChild(circle)
    }

    this.buildBboxSvg()
    this.buildReticleSvg()
  }

  private buildBboxSvg(): void {
    const NS = 'http://www.w3.org/2000/svg'
    const boxes: [number, number, number, number][] = [
      [116, 160, 32, 20],
      [168, 160, 32, 20],
      [136, 216, 48, 20],
    ]

    for (const [x, y, w, h] of boxes) {
      const rect = document.createElementNS(NS, 'rect')
      rect.setAttribute('x', String(x))
      rect.setAttribute('y', String(y))
      rect.setAttribute('width', String(w))
      rect.setAttribute('height', String(h))
      rect.setAttribute('fill', 'none')
      rect.setAttribute('stroke', '#D4AF37')
      rect.setAttribute('stroke-width', '0.7')
      rect.setAttribute('stroke-dasharray', '3 2')
      this.bboxGroupTarget.appendChild(rect)

      const corners: [number, number][] = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]
      for (let i = 0; i < corners.length; i++) {
        const [cx, cy] = corners[i]
        const dx = i % 2 === 0 ? 1 : -1
        const dy = i < 2 ? 1 : -1
        const hLine = document.createElementNS(NS, 'line')
        hLine.setAttribute('x1', String(cx))
        hLine.setAttribute('y1', String(cy))
        hLine.setAttribute('x2', String(cx + 4 * dx))
        hLine.setAttribute('y2', String(cy))
        hLine.setAttribute('stroke', '#D4AF37')
        hLine.setAttribute('stroke-width', '1.2')
        this.bboxGroupTarget.appendChild(hLine)

        const vLine = document.createElementNS(NS, 'line')
        vLine.setAttribute('x1', String(cx))
        vLine.setAttribute('y1', String(cy))
        vLine.setAttribute('x2', String(cx))
        vLine.setAttribute('y2', String(cy + 4 * dy))
        vLine.setAttribute('stroke', '#D4AF37')
        vLine.setAttribute('stroke-width', '1.2')
        this.bboxGroupTarget.appendChild(vLine)
      }
    }
  }

  private buildReticleSvg(): void {
    const NS = 'http://www.w3.org/2000/svg'
    const centers: [number, number][] = [[132, 170], [186, 170], [160, 226]]

    for (const [x, y] of centers) {
      const dot = document.createElementNS(NS, 'circle')
      dot.setAttribute('cx', String(x))
      dot.setAttribute('cy', String(y))
      dot.setAttribute('r', '1.5')
      dot.setAttribute('fill', '#D4AF37')
      this.reticleGroupTarget.appendChild(dot)

      const ring = document.createElementNS(NS, 'circle')
      ring.setAttribute('cx', String(x))
      ring.setAttribute('cy', String(y))
      ring.setAttribute('r', '6')
      ring.setAttribute('fill', 'none')
      ring.setAttribute('stroke', '#D4AF37')
      ring.setAttribute('stroke-width', '0.4')
      this.reticleGroupTarget.appendChild(ring)

      for (const [x1, y1, x2, y2] of [
        [x - 10, y, x - 3, y],
        [x + 3, y, x + 10, y],
        [x, y - 10, x, y - 3],
        [x, y + 3, x, y + 10],
      ] as [number, number, number, number][]) {
        const line = document.createElementNS(NS, 'line')
        line.setAttribute('x1', String(x1))
        line.setAttribute('y1', String(y1))
        line.setAttribute('x2', String(x2))
        line.setAttribute('y2', String(y2))
        line.setAttribute('stroke', '#D4AF37')
        line.setAttribute('stroke-width', '0.5')
        this.reticleGroupTarget.appendChild(line)
      }
    }
  }

  private buildTicksSvg(): void {
    const NS = 'http://www.w3.org/2000/svg'

    for (const x of [40, 80, 120, 160, 200, 240, 280]) {
      const line = document.createElementNS(NS, 'line')
      line.setAttribute('x1', String(x))
      line.setAttribute('y1', '0')
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', '4')
      line.setAttribute('stroke', '#00F2FF')
      line.setAttribute('stroke-width', '0.4')
      this.tickGroupTarget.appendChild(line)

      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', String(x + 2))
      text.setAttribute('y', '9')
      text.setAttribute('font-size', '5')
      text.setAttribute('font-family', 'ui-monospace,monospace')
      text.setAttribute('fill', 'rgba(0,242,255,.65)')
      text.setAttribute('letter-spacing', '.1em')
      text.textContent = String(x)
      this.tickGroupTarget.appendChild(text)
    }

    for (const y of [60, 120, 180, 240, 300, 360]) {
      const line = document.createElementNS(NS, 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', String(y))
      line.setAttribute('x2', '4')
      line.setAttribute('y2', String(y))
      line.setAttribute('stroke', '#00F2FF')
      line.setAttribute('stroke-width', '0.4')
      this.tickGroupTarget.appendChild(line)

      const text = document.createElementNS(NS, 'text')
      text.setAttribute('x', '6')
      text.setAttribute('y', String(y + 2.5))
      text.setAttribute('font-size', '5')
      text.setAttribute('font-family', 'ui-monospace,monospace')
      text.setAttribute('fill', 'rgba(0,242,255,.65)')
      text.setAttribute('letter-spacing', '.1em')
      text.textContent = String(y)
      this.tickGroupTarget.appendChild(text)
    }
  }

  private async analyze(): Promise<void> {
    if (!this.originalDataUrl) return

    let face: FaceData | null
    try {
      const detection = await detectFaceFromDataUrl(this.originalDataUrl)
      face = detection.face
    } catch (err) {
      console.error('FaceLandmarker detection error:', err)
      this.showError('顔検出エンジンの読み込みに失敗しました。通信環境を確認してください。')
      this.showStage('upload')
      return
    }

    if (!face) {
      this.showError('顔が検出されませんでした。正面を向いた写真をお試しください。')
      this.showStage('upload')
      return
    }

    this.faceData = face
    this.enhancedImageUrl = null

    // 「やりすぎる」用の Replicate 生成は裏で先行投げ。compose は待たずに進む。
    // ユーザーが「やりすぎる」を選んだ時点で enhancedImageUrl があれば即座に切替、
    // まだなら analyzing 画面を再利用してこの promise を await する。
    this.enhancedImagePromise = this.fetchEnhancedImage()

    await this.waitForAnimationAndCompose()
  }

  private async fetchEnhancedImage(): Promise<void> {
    if (!this.originalDataUrl) return
    try {
      const blob = dataUrlToBlob(this.originalDataUrl)
      const formData = new FormData()
      formData.append('file', blob, 'image.jpg')

      const response = await fetch('/api/enhancements', { method: 'POST', body: formData })
      if (!response.ok) {
        const errorBody = (await response.json().catch(() => ({}))) as { message?: string }
        console.warn('Enhancement API failed, falling back to local compose:', errorBody)
        this.enhancedImageUrl = null
        return
      }
      const data = (await response.json()) as { enhanced_image_url: string }
      this.enhancedImageUrl = data.enhanced_image_url
    } catch (err) {
      console.warn('Enhancement API error, falling back to local compose:', err)
      this.enhancedImageUrl = null
    }
  }

  private async waitForAnimationAndCompose(): Promise<void> {
    await new Promise<void>((resolve) => {
      const check = (): void => {
        if (this.analysisRaf === null) {
          resolve()
        } else {
          setTimeout(check, 200)
        }
      }
      setTimeout(check, 200)
    })

    await this.compose(this.intensityValue, { isInitial: true })
  }

  private async compose(
    intensity: Intensity,
    options: { isInitial?: boolean; retryCount?: number } = {},
  ): Promise<void> {
    if (!this.originalDataUrl || !this.faceData) return
    const { isInitial = false, retryCount = 0 } = options

    const resultCanvas = await this.buildResultCanvas(intensity)
    if (!resultCanvas) return

    this.composedCanvas = resultCanvas

    const ctx = this.resultCanvasTarget.getContext('2d')
    if (!ctx) return

    this.resultCanvasTarget.width = resultCanvas.width
    this.resultCanvasTarget.height = resultCanvas.height
    ctx.drawImage(resultCanvas, 0, 0)

    this.beforeImgTarget.src = this.originalDataUrl
    this.showStage('result')

    // メトリクスは intensity が変わるたびにアニメで再計算する(動的に変わる)。
    this.updateMetricsAnimated(intensity)

    // intensity 切替時は flash や review(SSE)を再実行しない("再読み込み感" の解消)。
    if (isInitial) {
      this.triggerFlash()
      this.serverScore = null
      await this.review(resultCanvas, intensity, retryCount)
    }
  }

  private async buildResultCanvas(intensity: Intensity): Promise<HTMLCanvasElement | null> {
    if (!this.faceData) return null

    // overdo: CodeFormer で復元された高画質画像 + 目・歯の領域のみ filter で強調
    // （catchlight や sparkle 等のオーバーレイは使わずフォトリアル寄りに）
    if (intensity === 'overdo' && this.enhancedImageUrl) {
      try {
        const img = await this.loadImage(this.enhancedImageUrl, /* crossOrigin */ true)
        const sourceCanvas = imageToCanvas(img)
        return composeFilterOnly(sourceCanvas, this.faceData)
      } catch (err) {
        console.warn('Enhanced image load failed, falling back to local compose:', err)
      }
    }

    if (!this.originalDataUrl) return null
    const img = await this.loadImage(this.originalDataUrl, false)
    const sourceCanvas = imageToCanvas(img)
    return composeFaceEffect(sourceCanvas, this.faceData, intensity)
  }

  private loadImage(src: string, crossOrigin: boolean): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      if (crossOrigin) img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
      img.src = src
    })
  }

  private async review(
    shinedCanvas: HTMLCanvasElement,
    intensity: Intensity,
    retryCount: number,
  ): Promise<void> {
    if (!this.originalDataUrl) return

    const originalBlob = dataUrlToBlob(this.originalDataUrl)
    const shinedBlob = await canvasToBlob(shinedCanvas)

    const formData = new FormData()
    formData.append('original_file', originalBlob, 'original.jpg')
    formData.append('shined_file', shinedBlob, 'shined.jpg')
    formData.append('intensity', intensity)
    formData.append('validate', String(intensity === 'sparkle' || intensity === 'overdo'))

    this.abortController?.abort()
    this.abortController = new AbortController()

    let qualityOk = true
    let commentText = ''

    try {
      await postSse(
        '/api/shine_reviews',
        formData,
        {
          comment_chunk: ({ text }) => {
            commentText += text
            this.commentDisplayTarget.textContent = commentText
          },
          score: ({ score }) => {
            this.serverScore = score
            this.scoreDisplayTarget.textContent = `SHINE INDEX · ${score} / 100`
            const target = this.computeAttract(this.intensityValue)
            this.animateMetric(this.metricAttractTarget, this.currentMetrics.attract, target, (v) => `+${v.toFixed(1)}`, 700)
            this.currentMetrics.attract = target
          },
          validate: ({ ok }) => {
            qualityOk = ok
          },
          done: () => {},
        },
        { signal: this.abortController.signal },
      )

      if (!qualityOk && retryCount < MAX_QUALITY_RETRIES) {
        await this.compose(intensity, { isInitial: true, retryCount: retryCount + 1 })
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      // silent fallback — display mock comment
      if (!commentText) {
        this.commentDisplayTarget.textContent =
          'このひと、目で語る人だ。瞳の奥に小さな星が一つ、ちゃんと棲んでいる。歯のラインは雨上がりのような清潔さで、笑った瞬間、街全体の彩度が0.3上がる。'
      }
    }
  }

  private async recompose(): Promise<void> {
    if (!this.faceData || !this.originalDataUrl) return
    await this.compose(this.intensityValue)
  }

  // 検出された目/歯のエリア + 選択 intensity から、瞳の輝き / 歯の白さの増分を推定。
  // attract は server score 到着後に動的に上書きされるが、それまで仮値を出す。
  private updateMetricsAnimated(intensity: Intensity): void {
    if (!this.faceData) return

    const eyeBaseByIntensity: Record<Intensity, number> = { standard: 10, sparkle: 22, overdo: 38 }
    const enamelBaseByIntensity: Record<Intensity, number> = { standard: 14, sparkle: 26, overdo: 42 }

    const leftOpen = this.faceData.eyes.left.state === 'open'
    const rightOpen = this.faceData.eyes.right.state === 'open'
    const eyeAreaLeft = leftOpen ? polygonAreaNorm(this.faceData.eyes.left.eye_polygon) : 0
    const eyeAreaRight = rightOpen ? polygonAreaNorm(this.faceData.eyes.right.eye_polygon) : 0
    const eyeAreaAvg = (eyeAreaLeft + eyeAreaRight) / 2
    const eyeBoost = clamp(eyeAreaAvg * 1500, 0, 14)
    const eyeJitter = (this.deterministicJitter('eye', intensity) - 0.5) * 4
    const eyeDelta = leftOpen || rightOpen
      ? Math.max(2, Math.round(eyeBaseByIntensity[intensity] + eyeBoost + eyeJitter))
      : 0

    const showsTeeth = this.faceData.mouth.state === 'open_showing_teeth' && !!this.faceData.mouth.teeth_polygon
    const teethArea = showsTeeth && this.faceData.mouth.teeth_polygon
      ? polygonAreaNorm(this.faceData.mouth.teeth_polygon)
      : 0
    const teethBoost = clamp(teethArea * 900, 0, 12)
    const enamelJitter = (this.deterministicJitter('enamel', intensity) - 0.5) * 4
    const enamelDelta = showsTeeth
      ? Math.max(3, Math.round(enamelBaseByIntensity[intensity] + teethBoost + enamelJitter))
      : 0

    const attract = this.computeAttract(intensity, eyeBoost, teethBoost)

    this.animateMetric(
      this.metricEyeTarget,
      this.currentMetrics.eye,
      eyeDelta,
      (v) => eyeDelta === 0 ? '—' : `+${Math.round(v)}%`,
      650,
    )
    this.animateMetric(
      this.metricEnamelTarget,
      this.currentMetrics.enamel,
      enamelDelta,
      (v) => enamelDelta === 0 ? '—' : `+${Math.round(v)}%`,
      650,
    )
    this.animateMetric(
      this.metricAttractTarget,
      this.currentMetrics.attract,
      attract,
      (v) => `+${v.toFixed(1)}`,
      650,
    )

    this.currentMetrics = { eye: eyeDelta, enamel: enamelDelta, attract }
  }

  // server score が来ていれば使い、まだなら intensity 別の仮値を返す。
  // intensity 別 multiplier で intensity 切替時にも attract を動かす。
  private computeAttract(intensity: Intensity, eyeBoost = 0, teethBoost = 0): number {
    const intensityMultiplier: Record<Intensity, number> = { standard: 1.0, sparkle: 1.18, overdo: 1.34 }
    if (this.serverScore !== null) {
      return this.serverScore * 0.38 * intensityMultiplier[intensity]
    }
    const fallback: Record<Intensity, number> = { standard: 18, sparkle: 28, overdo: 36 }
    return fallback[intensity] + eyeBoost * 0.2 + teethBoost * 0.15
  }

  // 0..1 の決定的擬似乱数。intensity と key で値が変わり、同じ条件では再現する。
  private deterministicJitter(key: string, intensity: Intensity): number {
    let h = 2166136261
    const s = key + intensity
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    return ((h >>> 0) % 1000) / 1000
  }

  private animateMetric(
    target: HTMLElement,
    fromVal: number,
    toVal: number,
    format: (v: number) => string,
    durationMs: number,
  ): void {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = fromVal + (toVal - fromVal) * eased
      target.textContent = format(v)
      if (t < 1) {
        this.metricRafs.push(requestAnimationFrame(tick))
      }
    }
    this.metricRafs.push(requestAnimationFrame(tick))
  }

  private renderMatchCard(): void {
    if (!this.composedCanvas) return
    const ctx = this.matchCanvasTarget.getContext('2d')
    if (!ctx) return
    this.matchCanvasTarget.width = this.composedCanvas.width
    this.matchCanvasTarget.height = this.composedCanvas.height
    ctx.drawImage(this.composedCanvas, 0, 0)
  }

  private clearError(): void {
    this.errorMessageTarget.textContent = ''
    this.errorMessageTarget.setAttribute('hidden', '')
  }

  private showError(message: string): void {
    this.errorMessageTarget.textContent = message
    this.errorMessageTarget.removeAttribute('hidden')
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function polygonAreaNorm(points: Point[]): number {
  let area = 0
  const n = points.length
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    area += points[i].x * points[j].y - points[j].x * points[i].y
  }
  return Math.abs(area) / 2
}
