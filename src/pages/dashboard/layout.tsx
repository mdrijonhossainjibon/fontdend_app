 
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useState } from "react"
import { Header } from "@/components/header"

export default function DashboardLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-background">
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <DashboardSidebar
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />

            <div className={`lg:ml-64`}>
                <Header />
            </div>

            <main className="min-h-screen transition-all duration-300 lg:ml-64">
                <Outlet />
            </main>
        </div>
    )
}
