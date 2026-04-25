const MAX_LONG_EDGE = 1024

export async function resizeToBase64(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const scale = Math.min(1, MAX_LONG_EDGE / Math.max(width, height))
  const targetWidth = Math.round(width * scale)
  const targetHeight = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const bytes = atob(data)
  const array = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    array[i] = bytes.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}
