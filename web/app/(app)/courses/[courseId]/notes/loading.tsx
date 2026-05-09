import { Skeleton } from '@/components/ui/skeleton'

export default function NotesLoading() {
  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-1.5 rounded-md p-2">
          <Skeleton className="h-4" style={{ width: `${60 + (i % 3) * 15}%` }} />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  )
}
