import { useState, useEffect, useRef } from 'react'

const icons = import.meta.glob('../../node_modules/cryptocurrency-icons/svg/color/*.svg', { query: '?url', eager: false }) as Record<string, () => Promise<{ default: string }>>

function resolveKey(ticker: string): string | undefined {
    const path = `../../node_modules/cryptocurrency-icons/svg/color/${ticker}.svg`
    return icons[path] ? path : undefined
}

interface CryptoIconProps {
    coinId: string
    className?: string
    color?: string
    bg?: string
    name?: string
}

export function CryptoIcon({ coinId, className = 'w-6 h-6', color, bg, name }: CryptoIconProps) {
    const [icon, setIcon] = useState<string | null>(null)
    const [errored, setErrored] = useState(false)
    const prevTicker = useRef<string | null>(null)

    const ticker = coinId.toLowerCase()
    const label = name || coinId
    const fillColor = color || '#6366f1'
    const bgColor = bg || '#e0e7ff'

    useEffect(() => {
        // Reset when coin changes
        if (prevTicker.current !== ticker) {
            setErrored(false)
            setIcon(null)
            prevTicker.current = ticker
        }

        const key = resolveKey(ticker)
        if (!key) {
            setErrored(true)
            return
        }

        const loader = icons[key]
        loader()
            .then((m) => {
                if (prevTicker.current === ticker) setIcon(m.default)
            })
            .catch(() => {
                if (prevTicker.current === ticker) setErrored(true)
            })
    }, [ticker])

    if (!errored && icon) {
        return <img src={icon} className={className} alt={coinId} />
    }

    // Loading shimmer while resolving icon
    if (!errored && !icon) {
        return <div className={`${className} rounded-full bg-secondary/50 animate-pulse shrink-0`} />
    }

    // Fallback: custom SVG logo
    const tickerShort = label.slice(0, 3).toUpperCase()
    const isLong = tickerShort.length > 2

    return (
        <svg
            viewBox="0 0 32 32"
            className={className}
            style={{ borderRadius: '50%' }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={`g-${coinId}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={fillColor} />
                    <stop offset="100%" stopColor={bgColor} />
                </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="16" fill={`url(#g-${coinId})`} />
            <text
                x="16"
                y="16"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={isLong ? 8 : 11}
                fontWeight="bold"
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing={isLong ? '0.5' : '0'}
            >
                {tickerShort}
            </text>
        </svg>
    )
}
