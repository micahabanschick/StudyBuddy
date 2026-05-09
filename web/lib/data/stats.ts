import 'server-only'
import { isDatabaseConfigured } from '@/lib/db'

export type DailyActivity = { date: string; count: number }

export type StudyStats = {
  streakDays: number
  reviewsToday: number
  reviewsThisWeek: number
  notesThisWeek: number
  activityGrid: DailyActivity[] // last 52 weeks
}

export async function getStudyStats(userId: string): Promise<StudyStats> {
  const empty: StudyStats = {
    streakDays: 0,
    reviewsToday: 0,
    reviewsThisWeek: 0,
    notesThisWeek: 0,
    activityGrid: [],
  }

  if (!isDatabaseConfigured()) return empty

  try {
    const { db } = await import('@/lib/db')
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)
    const yearStart = new Date(todayStart)
    yearStart.setFullYear(yearStart.getFullYear() - 1)

    const [todayReviews, weekReviews, weekNotes, allReviews] = await Promise.all([
      db.review.count({ where: { userId, ts: { gte: todayStart } } }),
      db.review.count({ where: { userId, ts: { gte: weekStart } } }),
      db.note.count({ where: { createdAt: { gte: weekStart } } }),
      db.review.findMany({
        where: { userId, ts: { gte: yearStart } },
        select: { ts: true },
        orderBy: { ts: 'asc' },
      }),
    ])

    // Build daily activity grid (last 365 days)
    const dayMap = new Map<string, number>()
    for (const r of allReviews) {
      const key = r.ts.toISOString().slice(0, 10)
      dayMap.set(key, (dayMap.get(key) ?? 0) + 1)
    }

    const activityGrid: DailyActivity[] = []
    for (let i = 364; i >= 0; i--) {
      const d = new Date(todayStart)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      activityGrid.push({ date: key, count: dayMap.get(key) ?? 0 })
    }

    // Streak: count consecutive days ending today with ≥1 review
    let streakDays = 0
    for (let i = activityGrid.length - 1; i >= 0; i--) {
      if (activityGrid[i].count > 0) streakDays++
      else break
    }

    return {
      streakDays,
      reviewsToday: todayReviews,
      reviewsThisWeek: weekReviews,
      notesThisWeek: weekNotes,
      activityGrid,
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[getStudyStats]', err)
    return empty
  }
}
