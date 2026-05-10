import 'server-only'
import { isDatabaseConfigured } from '@/lib/db'

export type SectionInfo = {
  dates: string | null
  days: string | null
  time: string | null
  room: string | null
  instructor: string | null
}

export type ScheduleInfo = {
  lecture: SectionInfo
  lab: SectionInfo
}

/** Parse | Field | Value | rows from a markdown table section heading. */
function parseTableSection(md: string, heading: string): Record<string, string> {
  const result: Record<string, string> = {}
  const headingIdx = md.indexOf(`## ${heading}`)
  if (headingIdx === -1) return result

  const section = md.slice(headingIdx)
  const nextHeading = section.search(/\n## /)
  const block = nextHeading === -1 ? section : section.slice(0, nextHeading)

  const rowRegex = /\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|/g
  let match
  while ((match = rowRegex.exec(block)) !== null) {
    const key = match[1].trim().toLowerCase()
    const val = match[2].trim()
    if (key && val && key !== 'field' && !key.startsWith('---')) {
      result[key] = val
    }
  }
  return result
}

function toSectionInfo(row: Record<string, string>): SectionInfo {
  return {
    dates: row['meeting dates'] ?? null,
    days: row['days'] ?? null,
    time: row['time'] ?? null,
    room: row['room'] ?? null,
    instructor: row['instructor'] ?? row['instructors'] ?? null,
  }
}

export async function getCourseSchedule(courseId: string): Promise<ScheduleInfo | null> {
  if (!isDatabaseConfigured()) return null
  try {
    const { db } = await import('@/lib/db')
    const note = await db.note.findFirst({
      where: { courseId, title: 'Course Overview & Schedule' },
      select: { contentMd: true },
    })
    if (!note?.contentMd) return null

    const lectureRow = parseTableSection(note.contentMd, 'Lecture Schedule')
    const labRow = parseTableSection(note.contentMd, 'Lab Schedule')

    return {
      lecture: toSectionInfo(lectureRow),
      lab: toSectionInfo(labRow),
    }
  } catch {
    return null
  }
}
