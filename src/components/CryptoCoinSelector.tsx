import { cn } from "@/lib/utils"
import { CryptoIcon } from "@/components/CryptoIcon"

interface CryptoConfig {
    id: string
    name: string
    fullName: string
    icon: string
    color: string
    bg: string
    borderGlow: string
    networks: any[]
    status: string
}

interface CryptoCoinSelectorProps {
    configs: CryptoConfig[]
    selectedId: string | null
    onSelect: (id: string) => void
}

export function CryptoCoinSelector({ configs, selectedId, onSelect }: CryptoCoinSelectorProps) {
    if (configs.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No cryptocurrencies available</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {configs.filter(c => c.status === 'active').map((coin) => (
                <button
                    key={coin.id}
                    onClick={() => onSelect(coin.id)}
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                        selectedId === coin.id
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-border bg-card hover:border-primary/30 hover:bg-secondary/30"
                    )}
                >
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
                        <CryptoIcon coinId={coin.id} className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-semibold">{coin.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-full">
                        {coin.fullName}
                    </span>
                </button>
            ))}
        </div>
    )
}
