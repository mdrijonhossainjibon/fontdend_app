import React, { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { logoutRequest } from "@/modules/auth/actions"
import type { RootState } from "@/modules/rootReducer"
import { Footer } from '@/components/landing/footer'
import { ChromeIcon } from '@/components/chrome-icon'
import {
    Download,
    Package,
    CheckCircle2,
    Globe,
    Monitor,
    ArrowDown,
    Loader2,
    FileArchive,
    Clock,
    Star,
    Share2,
    Copy,
    ChevronDown,
    User,
    LogOut,
    LayoutDashboard,
    Settings,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Extension {
    _id: string
    name: string
    description: string
    version: string
    platform: string
    changelog: string
    originalName: string
    fileSize: number
    fileType: string
    downloadUrl: string
    iconUrl?: string
    downloads: number
    createdAt: string
}

function formatBytes(bytes: number) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const platformIcons: Record<string, React.ElementType> = {
    Chrome: ChromeIcon,
    Firefox: Globe,
    Windows: Monitor,
    macOS: Monitor,
    Linux: Monitor,
    All: Globe,
}

function UserDropdown({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-secondary/50 transition-all border border-transparent hover:border-border/50"
      >
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
          alt="Avatar"
          className="w-8 h-8 rounded-full border border-primary/20 bg-background"
        />
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden z-[110]"
          >
            <div className="p-4 border-b border-border/50 bg-secondary/20">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Signed in as</p>
              <p className="text-sm font-bold truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-primary" />
                Dashboard
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
              >
                <Settings className="w-4 h-4 text-primary" />
                Settings
              </Link>
            </div>
            <div className="p-2 border-t border-border/50">
              <button
                onClick={() => { setIsOpen(false); onLogout() }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ExtensionsDownloadPage() {
    const dispatch = useDispatch()
    const { user, loginSuccess } = useSelector((state: RootState) => state.auth)
    const isLoggedIn = !!localStorage.getItem("authToken") || loginSuccess
    const currentUser = user || JSON.parse(localStorage.getItem("user") || "null")

    const [isDark, setIsDark] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => {
      dispatch(logoutRequest())
    }

    useEffect(() => { document.documentElement.classList.toggle("dark", isDark) }, [isDark])

    const navItems = [
      { label: 'Home', path: '/' },
      { label: 'API Docs', path: '/api-docs' },
      { label: 'How It Works', path: '/how-it-works' },
      { label: 'Contact', path: '/contact' },
      { label: 'Login', path: '/auth/login' },
    ]

    const [extensions, setExtensions] = useState<Extension[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [downloading, setDownloading] = useState<string | null>(null)
    const [filterPlatform, setFilterPlatform] = useState('All')

    useEffect(() => {
        fetchExtensions()
    }, [])

    const fetchExtensions = async () => {
        try {
            const res = await fetch('/api/extensions')
            const data = await res.json()
            if (data.success) {
                setExtensions(data.extensions)
            }
        } catch (err) {
            console.error('Failed to fetch extensions:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = async (ext: Extension) => {
        setDownloading(ext._id)
        try {
            // Track download
            await fetch('/api/admin/extensions/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ext._id }),
            })

            // Trigger download
            const link = document.createElement('a')
            link.href = ext.downloadUrl
            link.download = ext.originalName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download error:', err)
        } finally {
            setTimeout(() => setDownloading(null), 1000)
        }
    }

    const handleCopyLink = (ext: Extension) => {
        const url = `${window.location.origin}${ext.downloadUrl}`
        navigator.clipboard.writeText(url)
        toast({
            title: "Direct link copied!",
            description: "Direct download link is now in your clipboard.",
        })
    }

    const handleSocialShare = (ext: Extension) => {
        const url = `${window.location.origin}/extensions`
        const text = `Take a look at ${ext.name} extension!`

        if (navigator.share) {
            navigator.share({
                title: ext.name,
                url: url,
                text: text,
            }).catch(console.error)
        } else {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        }
        toast({
            title: "Share link ready!",
            description: "Thanks for sharing our extension.",
        })
    }

    const platforms = ['All', ...Array.from(new Set(extensions.map((e) => e.platform)))]
    const filtered =
        filterPlatform === 'All' ? extensions : extensions.filter((e) => e.platform === filterPlatform || e.platform === 'All')

    const getFileIcon = (fileType: string) => {
        const icons: Record<string, string> = {
            '.zip': 'ðŸ—œï¸',
            '.crx': 'ðŸ§©',
            '.xpi': 'ðŸ¦Š',
            '.exe': 'ðŸ–¥ï¸',
            '.dmg': 'ðŸŽ',
            '.deb': 'ðŸ§',
        }
        return icons[fileType] || 'ðŸ“¦'
    }

    return (
        <div className="selection:bg-primary/30 min-h-screen bg-background overflow-x-hidden transition-colors duration-300" style={{ paddingTop: 0 }}>
            {/* ── Inline styles ── */}
            <style>{`
              html { scroll-behavior: smooth; }
              ::-webkit-scrollbar { width: 6px; }
              ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: hsl(var(--primary) / 0.3); border-radius: 999px; }
            `}</style>

            {/* ── Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-border/50 bg-background/80 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-lg font-bold tracking-tighter flex items-center gap-2.5">
                  <img src="/logo.png" alt="CaptchaⱮaster" className="w-7 h-7 rounded-lg shadow-lg shadow-amber-500/20" />
                  <span className="hidden sm:inline">Captcha<span className="bg-gradient-to-r from-primary via-yellow-400 to-yellow-500 bg-clip-text text-transparent">Ɱaster</span></span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                  {navItems.map((item) => (
                    item.label === 'Login' ? (
                      <Link key={item.label} to={item.path} className="hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    ) : (
                      <Link key={item.label} to={item.path} className="hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground" aria-label="Toggle dark mode">
                    {isDark ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                  </button>
                  {isLoggedIn ? (
                    <UserDropdown user={currentUser} onLogout={handleLogout} />
                  ) : (
                    <Link to="/auth/signup" className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold text-sm shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Get API Key
                    </Link>
                  )}
                  {/* Mobile menu toggle */}
                  <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground" aria-label="Menu">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                  </button>
                </div>
              </div>
              {/* Mobile nav */}
              {mobileOpen && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
                  <div className="px-6 py-4 space-y-3">
                    {navItems.map((item) => (
                      <Link key={item.label} to={item.path} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{item.label}</Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 relative">
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6"
                            style={{ animation: 'float 3s ease-in-out infinite' }}
                        >
                            <Package className="w-8 h-8 text-amber-500" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4">
                            Extension{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                                Downloads
                            </span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl">
                            Download our official browser extensions and desktop tools to supercharge your captcha solving experience.
                        </p>
                        <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Verified & Safe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Always Up-to-Date</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span>Free Download</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Platform Filter */}
                {!isLoading && extensions.length > 0 && (
                    <div className="flex items-center gap-3 mb-8 flex-wrap">
                        {platforms.map((p) => (
                            <button
                                key={p}
                                onClick={() => setFilterPlatform(p)}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${filterPlatform === p
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                        <FileArchive className="w-16 h-16 mb-4 opacity-10" />
                        <p className="text-lg font-medium">No extensions available</p>
                        <p className="text-sm mt-1">Check back soon for new releases</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((ext, idx) => {
                            const PlatformIcon = platformIcons[ext.platform] || Globe
                            const isDownloadingThis = downloading === ext._id

                            return (
                                <div
                                    key={ext._id}
                                    className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300"
                                    style={{ opacity: 0, animation: `slideUp 0.5s ease-out ${idx * 80}ms forwards` }}
                                >
                                    {/* Top accent */}
                                    <div className="h-1 bg-gradient-to-r from-amber-500/80 via-orange-500/60 to-amber-500/20" />

                                    <div className="p-6">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                                                {ext.iconUrl ? (
                                                    <img src={ext.iconUrl} alt={ext.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    getFileIcon(ext.fileType)
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="font-bold text-foreground text-lg leading-tight truncate">{ext.name}</h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-semibold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">
                                                        v{ext.version}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <PlatformIcon className="w-3 h-3" />
                                                        <span>{ext.platform}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {ext.description && (
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{ext.description}</p>
                                        )}

                                        {/* Changelog */}
                                        {ext.changelog && (
                                            <div className="bg-muted/30 rounded-xl p-3 mb-4 border border-border/50">
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                                                    What's new
                                                </p>
                                                <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed line-clamp-4 font-mono">
                                                    {ext.changelog}
                                                </p>
                                            </div>
                                        )}

                                        {/* Meta */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-5">
                                            <div className="flex items-center gap-1">
                                                <Download className="w-3 h-3" />
                                                <span>{ext.downloads.toLocaleString()} downloads</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span>{formatBytes(ext.fileSize)}</span>
                                                <span>{ext.fileType}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDownload(ext)}
                                                disabled={isDownloadingThis}
                                                className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                            >
                                                {isDownloadingThis ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Downloading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ArrowDown className="w-4 h-4 group-hover:animate-bounce" />
                                                        Download Now
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleCopyLink(ext)}
                                                className="px-4 py-3 rounded-xl bg-muted/50 border border-border hover:bg-muted hover:text-blue-500 transition-all duration-300"
                                                title="Copy Link"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleSocialShare(ext)}
                                                className="px-4 py-3 rounded-xl bg-muted/50 border border-border hover:bg-muted hover:text-amber-500 transition-all duration-300"
                                                title="Share/Post"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Release date footer */}
                                    <div className="px-6 py-3 border-t border-border/40 bg-muted/20 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>
                                            Released{' '}
                                            {new Date(ext.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Help Section */}
                {!isLoading && filtered.length > 0 && (
                    <div className="mt-16 p-6 rounded-2xl bg-card/50 border border-border/40 text-center">
                        <h3 className="text-lg font-bold text-foreground mb-2">Need Help Installing?</h3>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                            Visit our documentation for step-by-step installation guides for each platform, or contact our support
                            team for assistance.
                        </p>
                    </div>
                )}
            </div>

            <Footer />

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
        </div>
    )
}
