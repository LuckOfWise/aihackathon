export interface SseEventMap {
  comment_chunk: { text: string }
  score: { score: number; summary: string }
  validate: { ok: boolean; issues: string[] }
  done: Record<string, never>
}

type SseEventType = keyof SseEventMap

type SseHandler<T extends SseEventType> = (data: SseEventMap[T]) => void

type SseHandlers = {
  [K in SseEventType]?: SseHandler<K>
}

export interface SseClientOptions {
  signal?: AbortSignal
}

export async function postSse(
  url: string,
  body: FormData,
  handlers: SseHandlers,
  options: SseClientOptions = {},
): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    body,
    headers: { Accept: 'text/event-stream' },
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`SSE request failed: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('Response body is not readable')

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      for (const raw of events) {
        const eventType = raw.match(/^event:\s*(.+)$/m)?.[1]?.trim()
        const dataLine = raw.match(/^data:\s*(.+)$/m)?.[1]?.trim()

        if (!eventType || !dataLine) continue

        try {
          const parsed = JSON.parse(dataLine) as SseEventMap[SseEventType]
          const handler = handlers[eventType as SseEventType]
          if (handler) {
            ;(handler as SseHandler<SseEventType>)(parsed)
          }
        } catch {
          // malformed JSON — skip
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
