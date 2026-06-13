import { useState, useEffect, useRef } from 'react'

const icons = import.meta.glob('../../node_modules/cryptocurrency-icons/svg/color/*.svg', { query: '?url', eager: false }) as Record<string, () => Promise<{ default: string }>>

function resolveKey(ticker: string): string | undefined {
    const path = `../../node_modules/cryptocurrency-icons/svg/color/${ticker}.svg`
    return icons[path] ? path : undefined
}

// CoinGecko coin ID mapping (ticker -> CoinGecko ID)
const COINGECKO_IDS: Record<string, string> = {
    btc: 'bitcoin',
    eth: 'ethereum',
    usdt: 'tether',
    trx: 'tron',
    xrp: 'ripple',
    ada: 'cardano',
    sol: 'solana',
    matic: 'matic-network',
    dot: 'polkadot',
    doge: 'dogecoin',
    shib: 'shiba-inu',
    bnb: 'binancecoin',
    dai: 'dai',
    usdc: 'usd-coin',
    busd: 'binance-usd',
    wbtc: 'wrapped-bitcoin',
    link: 'chainlink',
    uni: 'uniswap',
    atom: 'cosmos',
    etc: 'ethereum-classic',
    ltc: 'litecoin',
    bch: 'bitcoin-cash',
    xlm: 'stellar',
    vet: 'vechain',
    xtz: 'tezos',
    eos: 'eos',
    xmr: 'monero',
    neo: 'neo',
    icp: 'internet-computer',
    algo: 'algorand',
    apt: 'aptos',
    arb: 'arbitrum',
    avax: 'avalanche-2',
    cro: 'crypto-com-chain',
    fil: 'filecoin',
    flow: 'flow',
    ftm: 'fantom',
    gala: 'gala',
    hbar: 'hedera-hashgraph',
    inj: 'injective',
    Near: 'near',
    op: 'optimism',
    rose: 'oasis-network',
    sand: 'the-sandbox',
    sei: 'sei-network',
    sui: 'sui',
    theta: 'theta-token',
    ton: 'the-open-network',
    tribe: 'tribe-2',
    wemix: 'wemix-token',
    wow: 'wownero',
    zec: 'zcash',
    zil: 'zilliqa',
    zrx: '0x',
}

// Cache for CoinGecko URLs
const cgCache: Record<string, string> = {}

async function fetchFromCoinGecko(ticker: string): Promise<string | null> {
    const cgId = COINGECKO_IDS[ticker]
    if (!cgId) return null

    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cgId}`, {
            signal: AbortSignal.timeout(4000),
        })
        if (!res.ok) return null
        const data = await res.json()
        const url = data?.image?.large || data?.image?.small || null
        if (url) cgCache[ticker] = url
        return url
    } catch {
        return null
    }
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
    const [cgLoading, setCgLoading] = useState(false)
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
            setCgLoading(false)
            prevTicker.current = ticker
        }

        // If cached from CoinGecko, use it directly
        if (cgCache[ticker]) {
            setIcon(cgCache[ticker])
            return
        }

        const key = resolveKey(ticker)
        if (!key) {
            // Local icon not found — try CoinGecko
            setCgLoading(true)
            fetchFromCoinGecko(ticker).then((url) => {
                if (prevTicker.current !== ticker) return
                if (url) {
                    setIcon(url)
                } else {
                    setErrored(true)
                }
                setCgLoading(false)
            })
            return
        }

        const loader = icons[key]
        loader()
            .then((m) => {
                if (prevTicker.current === ticker) setIcon(m.default)
            })
            .catch(() => {
                // Local load failed — try CoinGecko
                if (prevTicker.current !== ticker) return
                setCgLoading(true)
                fetchFromCoinGecko(ticker).then((url) => {
                    if (prevTicker.current !== ticker) return
                    if (url) {
                        setIcon(url)
                    } else {
                        setErrored(true)
                    }
                    setCgLoading(false)
                })
            })
    }, [ticker])

    if (icon) {
        return <img src={icon} className={className} alt={coinId} />
    }

    // Loading shimmer while resolving
    if (!errored && (cgLoading || !icon)) {
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
