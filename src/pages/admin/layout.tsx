"use client"

import { Outlet } from "react-router-dom"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { Suspense, useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className={cn(
                "min-h-screen transition-all duration-300",
                "lg:ml-64",
                isSidebarOpen ? "ml-0" : "ml-0"
            )}>
                <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="p-4 sm:p-6">
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </div>
            </main>
        </div>
    )
}
