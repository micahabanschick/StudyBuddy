import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get('courseId')
  const q = req.nextUrl.searchParams.get('q') ?? ''

  if (!courseId) return NextResponse.json([], { status: 400 })

  const notes = await db.note.findMany({
    where: { courseId, title: { contains: q, mode: 'insensitive' } },
    select: { id: true, title: true },
    take: 10,
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(notes)
}
