"use client"

import { Outlet } from "react-router-dom"
import { ResellerSidebar } from "@/components/reseller-sidebar"
import { Suspense, useState } from "react"
import { cn } from "@/lib/utils"
import { ResellerHeader } from "@/components/reseller-header"
export default function ResellerLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <ResellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className={cn(
                "min-h-screen transition-all duration-300",
                "lg:ml-64",
                isSidebarOpen ? "ml-0" : "ml-0"
            )}>
                <ResellerHeader />
                <div className="p-4 sm:p-6">
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
