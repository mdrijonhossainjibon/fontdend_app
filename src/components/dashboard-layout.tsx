"use client"

import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Link } from 'react-router-dom'
import type { ReactNode } from "react"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-card">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
              <img                 src="/logo.png"
                alt="Logo"
                style={{ width: 32 }}
                
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg font-bold text-foreground">
              Captcha<span className="text-primary">Ɱaster</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="min-h-screen transition-all duration-300 pt-16 lg:pt-0 bg-card">
        <div className="w-full px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  )
}
