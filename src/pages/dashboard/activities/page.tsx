import { Suspense } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DashboardActivitiesContent } from '@/components/dashboard-activities-content'

export default function DashboardActivitiesPage() {
  return (
    <Suspense fallback={null}>
 
        <DashboardActivitiesContent />
 
    </Suspense>
  )
}
