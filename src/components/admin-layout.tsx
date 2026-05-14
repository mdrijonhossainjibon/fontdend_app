"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import type { ReactNode } from "react"
import { Suspense } from "react"

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="ml-64 min-h-screen transition-all duration-300">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
