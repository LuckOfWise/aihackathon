import {
  FilesetResolver,
  FaceLandmarker,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision'
import type { EyeData, FaceData, MouthData, Point } from '../types/face'

const WASM_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

// MediaPipe FaceLandmarker "Face mesh with iris refinement" landmark indices.
// https://developers.google.com/mediapipe/solutions/vision/face_landmarker
const LEFT_EYE_CONTOUR = [
  33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246,
] as const
const RIGHT_EYE_CONTOUR = [
  362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398,
] as const
const LEFT_IRIS_RING = [468, 469, 470, 471, 472] as const
const RIGHT_IRIS_RING = [473, 474, 475, 476, 477] as const
const INNER_LIPS = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191,
] as const
const UPPER_INNER_LIP = 13
const LOWER_INNER_LIP = 14

let landmarkerPromise: Promise<FaceLandmarker> | null = null

const getLandmarker = async (): Promise<FaceLandmarker> => {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE)
      return FaceLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'IMAGE',
        numFaces: 1,
        outputFaceBlendshapes: false,
      })
    })().catch((err) => {
      landmarkerPromise = null
      throw err
    })
  }
  return landmarkerPromise
}

export const preloadFaceLandmarker = (): void => {
  void getLandmarker().catch(() => {
    // Ignore — real call will surface the error
  })
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('image_load_failed'))
    img.src = src
  })

const pickPoints = (landmarks: NormalizedLandmark[], indices: readonly number[]): Point[] =>
  indices.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }))

const pixelDistance = (a: Point, b: Point, imageW: number, imageH: number): number =>
  Math.hypot((a.x - b.x) * imageW, (a.y - b.y) * imageH)

const eyeOpenState = (
  landmarks: NormalizedLandmark[],
  contour: readonly number[],
  imageW: number,
  imageH: number,
): 'open' | 'closed' => {
  const pts = contour.map((i) => landmarks[i])
  const xs = pts.map((p) => p.x * imageW)
  const ys = pts.map((p) => p.y * imageH)
  const spanX = Math.max(...xs) - Math.min(...xs)
  const spanY = Math.max(...ys) - Math.min(...ys)
  if (spanX <= 0) return 'closed'
  return spanY / spanX > 0.18 ? 'open' : 'closed'
}

const buildEye = (
  landmarks: NormalizedLandmark[],
  contour: readonly number[],
  iris: readonly number[],
  imageW: number,
  imageH: number,
): EyeData => {
  const eyePolygon = pickPoints(landmarks, contour)
  const irisPoints = pickPoints(landmarks, iris)
  const irisCenter = irisPoints[0]
  const minDim = Math.min(imageW, imageH)
  const irisRadiusPx = Math.max(
    ...irisPoints.slice(1).map((p) => pixelDistance(p, irisCenter, imageW, imageH)),
  )
  return {
    state: eyeOpenState(landmarks, contour, imageW, imageH),
    iris_center: irisCenter,
    iris_radius: irisRadiusPx / minDim,
    eye_polygon: eyePolygon,
  }
}

const MOUTH_OPEN_THRESHOLD = 0.025

const buildMouth = (
  landmarks: NormalizedLandmark[],
  faceBboxH: number,
): MouthData => {
  const innerPolygon = pickPoints(landmarks, INNER_LIPS)
  const openingRatio = (landmarks[LOWER_INNER_LIP].y - landmarks[UPPER_INNER_LIP].y) / faceBboxH
  if (openingRatio < MOUTH_OPEN_THRESHOLD) {
    return { state: 'closed', teeth_polygon: null }
  }
  return { state: 'open_showing_teeth', teeth_polygon: innerPolygon }
}

const boundingBox = (landmarks: NormalizedLandmark[]): FaceData['bounding_box'] => {
  const xs = landmarks.map((p) => p.x)
  const ys = landmarks.map((p) => p.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

const toFaceData = (
  landmarks: NormalizedLandmark[],
  imageW: number,
  imageH: number,
): FaceData => {
  const bbox = boundingBox(landmarks)
  return {
    confidence: 0.95,
    bounding_box: bbox,
    eyes: {
      left: buildEye(landmarks, LEFT_EYE_CONTOUR, LEFT_IRIS_RING, imageW, imageH),
      right: buildEye(landmarks, RIGHT_EYE_CONTOUR, RIGHT_IRIS_RING, imageW, imageH),
    },
    mouth: buildMouth(landmarks, bbox.h),
  }
}

export interface LocalFaceDetection {
  face: FaceData | null
  imageSize: { width: number; height: number }
}

export const detectFaceFromDataUrl = async (dataUrl: string): Promise<LocalFaceDetection> => {
  const img = await loadImage(dataUrl)
  const landmarker = await getLandmarker()
  const result = landmarker.detect(img)
  const imageSize = { width: img.naturalWidth, height: img.naturalHeight }
  const first = result.faceLandmarks[0]
  if (!first || first.length < 478) {
    return { face: null, imageSize }
  }
  return { face: toFaceData(first, imageSize.width, imageSize.height), imageSize }
}
