import 'server-only'
import { isDatabaseConfigured } from '@/lib/db'

export type ScheduleInfo = {
  dates: string | null
  days: string | null
  time: string | null
  room: string | null
  instructors: string | null
  section: string | null
  classNum: string | null
}

/** Parse | Field | Value | rows from a markdown table section. */
function parseTableSection(md: string, heading: string): Record<string, string> {
  const result: Record<string, string> = {}
  const headingIdx = md.indexOf(`## ${heading}`)
  if (headingIdx === -1) return result

  const section = md.slice(headingIdx)
  const nextHeading = section.search(/\n## /)
  const block = nextHeading === -1 ? section : section.slice(0, nextHeading)

  const rowRegex = /\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/g
  let match
  while ((match = rowRegex.exec(block)) !== null) {
    const key = match[1].trim()
    const val = match[2].trim()
    if (key && val && key !== 'Field' && !key.startsWith('---')) {
      result[key.toLowerCase()] = val
    }
  }
  return result
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

    const details = parseTableSection(note.contentMd, 'Section Details')
    const schedule = parseTableSection(note.contentMd, 'Lab Schedule')

    return {
      dates: schedule['meeting dates'] ?? null,
      days: schedule['days'] ?? null,
      time: schedule['time'] ?? null,
      room: schedule['room'] ?? null,
      instructors: schedule['instructor'] ?? schedule['instructors'] ?? null,
      section: details['component'] ?? null,
      classNum: details['class #'] ?? null,
    }
  } catch {
    return null
  }
}
