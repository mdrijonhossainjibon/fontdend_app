import { Suspense } from "react"
 
import { DashboardPricing } from "@/components/dashboard-pricing"

export default function DashboardPricingPage() {
    return (
        <Suspense fallback={null}>
       
                <DashboardPricing />
           
        </Suspense>
    )
}
