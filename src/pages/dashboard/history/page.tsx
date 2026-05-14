import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHistoryContent } from "@/components/dashboard-history-content"
import { SkeletonTable } from "@/components/skeletons"

export default function DashboardHistoryPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<SkeletonTable />}>
        <DashboardHistoryContent />
      </Suspense>
    </DashboardLayout>
  )
}
