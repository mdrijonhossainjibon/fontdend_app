import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="h-6 bg-secondary rounded-lg w-32 animate-pulse" />
        <div className="h-4 bg-secondary rounded-lg w-48 mt-2 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-secondary rounded-lg w-full animate-pulse" />
          <div className="h-4 bg-secondary rounded-lg w-5/6 animate-pulse" />
          <div className="h-4 bg-secondary rounded-lg w-4/6 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50 bg-secondary/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-secondary rounded-lg w-24 animate-pulse mb-2" />
                <div className="h-8 bg-secondary rounded-lg w-16 animate-pulse" />
              </div>
              <div className="w-8 h-8 bg-secondary rounded-lg animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-border/50 last:border-b-0">
          <div className="w-4 h-4 bg-secondary rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-secondary rounded-lg w-32 animate-pulse" />
            <div className="h-3 bg-secondary rounded-lg w-24 animate-pulse" />
          </div>
          <div className="h-4 bg-secondary rounded-lg w-20 animate-pulse" />
          <div className="h-4 bg-secondary rounded-lg w-16 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
