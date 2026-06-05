
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, Trash2, Database, Zap, CheckCircle2, Grid3X3, Loader2 } from "lucide-react"
import { Stats } from "./_types"

// â”€â”€ Stats Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function StatsCards({ stats }: { stats: Stats | null }) {
    const cards = [
        { label: "Total Cached", value: stats?.total ?? 'â€”', icon: Database, color: "text-blue-600", bg: "bg-blue-500/10" },
        { label: "Today", value: stats?.today ?? 'â€”', icon: Zap, color: "text-green-600", bg: "bg-green-500/10" },
        { label: "hCaptcha", value: stats?.byService?.hcaptcha ?? 0, icon: CheckCircle2, color: "text-teal-600", bg: "bg-teal-500/10" },
        { label: "Classify", value: stats?.byType?.objectClassify ?? 0, icon: Grid3X3, color: "text-purple-600", bg: "bg-purple-500/10" },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
            {cards.map((s, i) => {
                const Icon = s.icon
                return (
                    <Card key={i}
                        className="border-border hover:border-primary/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${i * 70}ms` }}>
                        <CardContent className="pt-4 pb-3 sm:pt-5 sm:pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                                    </p>
                                </div>
                                <div className={`p-2 sm:p-2.5 rounded-lg ${s.bg} shrink-0`}>
                                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

// â”€â”€ Filters Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FiltersProps {
    searchTerm: string
    serviceFilter: string
    typeFilter: string
    onSearch: (v: string) => void
    onService: (v: string) => void
    onType: (v: string) => void
    onRefresh: () => void
    onClearAll: () => void
    isSearching?: boolean   // true while debounce is pending
}

export function FiltersBar({
    searchTerm, serviceFilter, typeFilter,
    onSearch, onService, onType, onRefresh, onClearAll,
    isSearching = false,
}: FiltersProps) {
    return (
        <Card className="mb-5">
            <CardContent className="pt-4 sm:pt-5">
                <div className="flex flex-col gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by question..."
                            value={searchTerm}
                            onChange={e => onSearch(e.target.value)}
                            className="w-full pl-10 pr-9 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        {/* Debounce pending spinner */}
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                        )}
                    </div>
                    {/* Selects + Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <select value={serviceFilter} onChange={e => onService(e.target.value)}
                            className="flex-1 min-w-[130px] px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                            <option value="">All Services</option>
                            <option value="hcaptcha">hCaptcha</option>
                            <option value="awswaf">AWS WAF</option>
                            <option value="recaptcha">reCAPTCHA</option>
                            <option value="kbs">KBS</option>
                            <option value="trype">TRYPE</option>
                        </select>
                        <select value={typeFilter} onChange={e => onType(e.target.value)}
                            className="flex-1 min-w-[130px] px-3 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                            <option value="">All Types</option>
                            <option value="objectClassify">Classify</option>
                            <option value="objectClick">Click</option>
                            <option value="objectDrag">Drag</option>
                            <option value="objectTag">Tag</option>
                        </select>
                        <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5 shrink-0 text-xs">
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClearAll}
                            className="gap-1.5 shrink-0 border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white text-xs">
                            <Trash2 className="w-3.5 h-3.5" /> Clear Cache
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
