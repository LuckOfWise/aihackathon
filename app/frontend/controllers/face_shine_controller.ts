import { Controller } from '@hotwired/stimulus'
import { resizeToBase64, dataUrlToBlob } from '../lib/image_resize'
import { composeFaceEffect, canvasToBlob, imageToCanvas } from '../lib/compose'
import { postSse } from '../lib/sse_client'
import type {
  FaceAnalysisResponse,
  FaceAnalysisError,
  FaceData,
  Intensity,
} from '../types/face'

type Stage = 'hero' | 'upload' | 'analyzing' | 'result' | 'verdict' | 'match'

const ANALYSIS_LOG = [
  '▸ Booting SHINE-MATE engine v0.9.3',
  '▸ claude-haiku-4-5 · context loaded (1024 tok)',
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
  '▸ Asking Claude for editorial verdict…',
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
const ANALYSIS_DURATION_MS = 8000

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

  declare stageValue: Stage
  declare intensityValue: Intensity

  private originalDataUrl: string | null = null
  private faceData: FaceData | null = null
  private composedCanvas: HTMLCanvasElement | null = null
  private abortController: AbortController | null = null
  private analysisRaf: number | null = null
  private qualityRetryCount = 0
  private cameraStream: MediaStream | null = null

  connect(): void {
    this.buildMeshSvg()
    this.buildTicksSvg()
    this.showStage('hero')
  }

  disconnect(): void {
    this.abortController?.abort()
    if (this.analysisRaf !== null) {
      cancelAnimationFrame(this.analysisRaf)
      this.analysisRaf = null
    }
    this.stopCameraStream()
  }

  gotoHero(): void { this.showStage('hero') }
  gotoUpload(): void { this.showStage('upload') }
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
    if (this.faceData && this.originalDataUrl) {
      await this.recompose()
    }
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

    const blob = dataUrlToBlob(this.originalDataUrl)
    const formData = new FormData()
    formData.append('file', blob, 'image.jpg')

    let response: Response
    try {
      response = await fetch('/api/face_analyses', { method: 'POST', body: formData })
    } catch {
      this.showError('ネットワークエラーが発生しました')
      this.showStage('upload')
      return
    }

    if (!response.ok) {
      const errorBody = (await response.json()) as FaceAnalysisError
      this.showError(errorBody.advice || '顔の検出に失敗しました')
      this.showStage('upload')
      return
    }

    const data = (await response.json()) as FaceAnalysisResponse
    const { landmarks, recommended_intensity } = data

    if (!landmarks.face) {
      this.showError('顔が検出されませんでした。正面を向いた写真をお試しください。')
      this.showStage('upload')
      return
    }

    this.faceData = landmarks.face
    this.intensityValue = recommended_intensity

    await this.waitForAnimationAndCompose()
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

    await this.compose(this.intensityValue)
  }

  private async compose(intensity: Intensity, retryCount = 0): Promise<void> {
    if (!this.originalDataUrl || !this.faceData) return

    const img = new Image()
    img.src = this.originalDataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
    })

    const sourceCanvas = imageToCanvas(img)
    const resultCanvas = composeFaceEffect(sourceCanvas, this.faceData, intensity)
    this.composedCanvas = resultCanvas

    const ctx = this.resultCanvasTarget.getContext('2d')
    if (!ctx) return

    this.resultCanvasTarget.width = resultCanvas.width
    this.resultCanvasTarget.height = resultCanvas.height
    ctx.drawImage(resultCanvas, 0, 0)

    this.beforeImgTarget.src = this.originalDataUrl

    this.triggerFlash()
    this.showStage('result')

    await this.review(resultCanvas, intensity, retryCount)
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
    formData.append('validate', String(intensity === 'sparkle'))

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
            this.scoreDisplayTarget.textContent = `SHINE INDEX · ${score} / 100`
            this.metricAttractTarget.textContent = `+${(score * 0.38).toFixed(1)}`
          },
          validate: ({ ok }) => {
            qualityOk = ok
          },
          done: () => {},
        },
        { signal: this.abortController.signal },
      )

      if (!qualityOk && retryCount < MAX_QUALITY_RETRIES) {
        await this.compose(intensity, retryCount + 1)
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
