'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { DailyActivity } from '@/lib/data/stats'

function intensity(count: number): string {
  if (count === 0) return 'bg-muted/60'
  if (count < 5) return 'bg-primary/30'
  if (count < 15) return 'bg-primary/60'
  if (count < 30) return 'bg-primary/80'
  return 'bg-primary'
}

export function ActivityHeatmap({ data }: { data: DailyActivity[] }) {
  // Group into 53 columns of 7 rows (weeks × days)
  const weeks: DailyActivity[][] = []
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['', 'Mon', '', 'Wed', '', 'Fri', '']

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-3">
        {/* Day labels */}
        <div className="flex flex-col justify-around pt-5">
          {days.map((d, i) => (
            <span key={i} className="text-muted-foreground h-3 text-[10px] leading-none">
              {d}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1">
            {weeks.map((week, wi) => {
              const firstDay = week[0]?.date
              if (!firstDay) return <div key={wi} className="w-3" />
              const d = new Date(firstDay)
              const showMonth = d.getDate() <= 7
              return (
                <div key={wi} className="w-3 text-center">
                  {showMonth && (
                    <span className="text-muted-foreground text-[10px] leading-none">
                      {months[d.getMonth()]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day) => (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`h-3 w-3 cursor-default rounded-sm transition-opacity hover:opacity-80 ${intensity(day.count)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {day.count === 0 ? 'No reviews' : `${day.count} review${day.count === 1 ? '' : 's'}`}
                        {' — '}
                        {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
