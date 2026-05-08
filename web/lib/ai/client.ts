import 'server-only'
import { serverEnv } from '@/lib/env'

export class AIServiceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'AIServiceError'
  }
}

type RequestOpts = {
  jwt?: string | null
  signal?: AbortSignal
}

export async function aiFetch<T = unknown>(
  path: string,
  init: RequestInit & RequestOpts = {},
): Promise<T> {
  const { jwt, signal, headers, ...rest } = init
  const url = new URL(path, serverEnv.AI_SERVICE_URL).toString()

  const res = await fetch(url, {
    ...rest,
    signal,
    headers: {
      'content-type': 'application/json',
      ...(jwt ? { authorization: `Bearer ${jwt}` } : {}),
      ...(serverEnv.AI_SERVICE_SECRET ? { 'x-service-secret': serverEnv.AI_SERVICE_SECRET } : {}),
      ...headers,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new AIServiceError(text || res.statusText, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
