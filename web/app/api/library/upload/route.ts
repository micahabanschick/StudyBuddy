import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db, isDatabaseConfigured } from '@/lib/db'
import { serverEnv, publicEnv } from '@/lib/env'

export async function POST(req: NextRequest) {
  if (!isDatabaseConfigured() || !publicEnv.NEXT_PUBLIC_SUPABASE_URL || !serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 503 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const courseId = formData.get('courseId') as string | null

  if (!file || !courseId) {
    return NextResponse.json({ error: 'Missing file or courseId' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (50 MB max)' }, { status: 400 })
  }

  const supabase = createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  )

  const storagePath = `${courseId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

  const { error: uploadError } = await supabase.storage
    .from('course-documents')
    .upload(storagePath, file, { contentType: 'application/pdf', upsert: false })

  if (uploadError) {
    console.error('[upload] Supabase storage error:', uploadError)
    return NextResponse.json(
      { error: uploadError.message.includes('Bucket not found')
          ? 'Storage bucket not set up. Create a "course-documents" bucket in Supabase Storage.'
          : uploadError.message },
      { status: 500 },
    )
  }

  const doc = await db.document.create({
    data: {
      courseId,
      title: file.name.replace(/\.pdf$/i, ''),
      storagePath,
      status: 'pending',
    },
    select: { id: true, title: true, status: true },
  })

  // Fire-and-forget: ask the AI service to start ingestion
  const aiUrl = serverEnv.AI_SERVICE_URL
  if (aiUrl) {
    fetch(`${aiUrl}/rag/ingest`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-service-secret': serverEnv.AI_SERVICE_SECRET ?? '',
      },
      body: JSON.stringify({ documentId: doc.id, storagePath, courseId }),
    }).catch(() => {/* ingestion is async, errors logged in ai service */})
  }

  return NextResponse.json({ document: doc })
}
