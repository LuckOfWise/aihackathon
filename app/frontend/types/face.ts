export type Intensity = 'subtle' | 'standard' | 'sparkle'

export interface Point {
  x: number
  y: number
}

export interface EyeData {
  state: 'open' | 'closed'
  iris_center: Point
  iris_radius: number
  eye_polygon: Point[]
}

export interface MouthData {
  state: 'open_showing_teeth' | 'open_no_teeth' | 'closed'
  teeth_polygon: Point[] | null
}

export interface FaceData {
  confidence: number
  bounding_box: { x: number; y: number; w: number; h: number }
  eyes: {
    left: EyeData
    right: EyeData
  }
  mouth: MouthData
}

export interface LandmarksResponse {
  image_size: { width: number; height: number }
  face: FaceData | null
}

export interface FaceAnalysisResponse {
  landmarks: LandmarksResponse
  recommended_intensity: Intensity
  intensity_reason: string
}

export interface FaceAnalysisError {
  error: 'no_face_detected' | 'low_confidence' | 'multiple_faces'
  advice: string
}

export type FaceShineState =
  | 'idle'
  | 'analyzing'
  | 'composing'
  | 'reviewing'
  | 'done'
  | 'error'
