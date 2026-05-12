import { Skeleton } from '@/components/ui/skeleton'

export default function NoteLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-8 py-4">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="flex-1 space-y-3 px-8 py-4">
        {[80, 65, 90, 55, 70, 60, 45, 75].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${w}%` }} />
        ))}
        <div className="pt-4">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
