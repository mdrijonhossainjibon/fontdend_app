import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, Trash2, Database, Zap, Loader2 } from "lucide-react"
import { Stats } from "./_types"
import { HCaptchaIcon } from "./_svgs"

// ── Stats Cards ─────────────────────────────────────────────────────────────
export function StatsCards({ stats }: { stats: Stats | null }) {
    const cards = [
        {
            label: "Total Cached", value: stats?.total ?? '—',
            icon: Database, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/15",
            gradient: "from-blue-500/5 via-transparent to-transparent",
        },
        {
            label: "Today", value: stats?.today ?? '—',
            icon: Zap, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10 dark:bg-green-500/15",
            gradient: "from-green-500/5 via-transparent to-transparent",
        },
        {
            label: "hCaptcha", value: stats?.byService?.hcaptcha ?? 0,
            icon: HCaptchaIcon, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500/10 dark:bg-teal-500/15",
            gradient: "from-teal-500/5 via-transparent to-transparent",
        },
        {
            label: "Classify", value: stats?.byType?.objectClassify ?? 0,
            icon: Database, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10 dark:bg-purple-500/15",
            gradient: "from-purple-500/5 via-transparent to-transparent",
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {cards.map((s, i) => {
                const Icon = s.icon
                return (
                    <Card key={i}
                        className="group relative border-border hover:border-primary/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 overflow-hidden"
                        style={{ animationDelay: `${i * 70}ms` }}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                        <CardContent className="pt-4 pb-3 sm:pt-5 sm:pb-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1 font-medium tracking-wide uppercase">{s.label}</p>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                                    </p>
                                </div>
                                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[4deg]`}>
                                    <Icon size={20} strokeWidth={1.8} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

// ── Filters Bar ─────────────────────────────────────────────────────────────
interface FiltersProps {
    search: string
    onSearchChange: (v: string) => void
    service: string
    onServiceChange: (v: string) => void
    type: string
    onTypeChange: (v: string) => void
    onRefresh: () => void
    onClearAll: () => void
    refreshing?: boolean
}

const SERVICE_OPTIONS = [
    { value: '', label: 'All Services' },
    { value: 'hcaptcha', label: 'hCaptcha' },
    { value: 'awswaf', label: 'AWS WAF' },
    { value: 'recaptcha', label: 'reCAPTCHA' },
    { value: 'kbs', label: 'KBS' },
]

const TYPE_OPTIONS = [
    { value: '', label: 'All Types' },
    { value: 'objectClassify', label: 'Classify' },
    { value: 'objectClick', label: 'Click' },
    { value: 'objectDrag', label: 'Drag' },
    { value: 'objectTag', label: 'Tag' },
]

export function FiltersBar({
    search, onSearchChange,
    service, onServiceChange,
    type, onTypeChange,
    onRefresh, onClearAll,
    refreshing,
}: FiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by hash or question..."
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-border bg-background/50 placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                {search && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground text-xs"
                    >✕</button>
                )}
            </div>

            {/* Service filter */}
            <select
                value={service}
                onChange={e => onServiceChange(e.target.value)}
                className="h-9 px-3 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all"
            >
                {SERVICE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Type filter */}
            <select
                value={type}
                onChange={e => onTypeChange(e.target.value)}
                className="h-9 px-3 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-all"
            >
                {TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Refresh */}
            <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={onRefresh} disabled={refreshing} title="Refresh">
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </Button>

            {/* Clear All */}
            <Button variant="destructive" size="sm" className="h-9 shrink-0 gap-1.5" onClick={onClearAll}>
                <Trash2 size={14} />
                <span className="hidden sm:inline">Clear All</span>
            </Button>
        </div>
    )
}
