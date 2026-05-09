import 'server-only'
import { NextRequest } from 'next/server'
import { aiFetch } from '@/lib/ai/client'

export async function GET(req: NextRequest) {
  const smiles = req.nextUrl.searchParams.get('smiles')
  if (!smiles) return new Response('smiles param required', { status: 400 })

  try {
    const svg = await aiFetch<string>(`/chem/smiles/${encodeURIComponent(smiles)}`)
    return new Response(svg as unknown as string, {
      headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public, max-age=86400' },
    })
  } catch {
    return new Response('Failed to render SMILES', { status: 502 })
  }
}
