import { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function sz(size?: number) {
    return { width: size ?? 20, height: size ?? 20, viewBox: "0 0 24 24" }
}

// ── hCaptcha ────────────────────────────────────────────────────────────────
export function HCaptchaIcon({ size, ...props }: IconProps) {
    return (
        <svg {...sz(size)} fill="none" {...props}>
            <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 9v6M12 9v6M16 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.6" />
            <circle cx="16" cy="12" r="2" fill="currentColor" opacity="0.6" />
        </svg>
    )
}

// ── AWS WAF ─────────────────────────────────────────────────────────────────
export function AwsWafIcon({ size, ...props }: IconProps) {
    return (
        <svg {...sz(size)} fill="none" {...props}>
            <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11 5.17-.85 9-5.75 9-11V7l-9-5z"
                stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 7l-3 3 3 3 3-3-3-3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M9 14l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    )
}

// ── reCAPTCHA ───────────────────────────────────────────────────────────────
export function RecaptchaIcon({ size, ...props }: IconProps) {
    return (
        <svg {...sz(size)} fill="none" {...props}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3v6M12 15v6M3 12h6M15 12h6"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.7" />
            <path d="M12 3a9 9 0 010 18" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
        </svg>
    )
}

// ── KBS ─────────────────────────────────────────────────────────────────────
export function KbsIcon({ size, ...props }: IconProps) {
    return (
        <svg {...sz(size)} fill="none" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="17" cy="16" r="2" fill="currentColor" opacity="0.5" />
        </svg>
    )
}

// ── Loading Skeleton ────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
    return (
        <div className="space-y-2 p-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className={`flex items-center gap-3 rounded-lg bg-secondary/30 p-3 ${shimmer}`}>
                    <div className="w-8 h-8 rounded-md bg-muted" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/5 rounded bg-muted" />
                        <div className="h-2.5 w-2/5 rounded bg-muted" />
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-7 h-7 rounded-md bg-muted" />
                        <div className="w-7 h-7 rounded-md bg-muted" />
                    </div>
                </div>
            ))}
            <style>{`
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                .animate-shimmer { animation: shimmer 1.5s infinite; }
            `}</style>
        </div>
    )
}

// ── Empty State ─────────────────────────────────────────────────────────────
export function EmptyStateSvg({ compact = false }: { compact?: boolean }) {
    return (
        <svg viewBox="0 0 200 140" className={compact ? "w-32 h-24" : "w-40 h-32"} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Database cylinder */}
            <ellipse cx="100" cy="38" rx="50" ry="14" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
            <path d="M50 38v52c0 7.73 22.38 14 50 14s50-6.27 50-14V38"
                stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30" />
            <ellipse cx="100" cy="90" rx="50" ry="14" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/20" />
            {/* Inner lines */}
            <path d="M50 60c0 7.73 22.38 14 50 14s50-6.27 50-14"
                stroke="currentColor" strokeWidth="1" className="text-muted-foreground/15" />
            {/* Magnifying glass */}
            <circle cx="128" cy="48" r="12" stroke="currentColor" strokeWidth="1.8"
                className="text-muted-foreground/40" strokeDasharray="4 2" />
            <path d="M136 56l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                className="text-muted-foreground/40" />
            {/* Small floating particles */}
            <circle cx="72" cy="76" r="2" fill="currentColor" className="text-muted-foreground/20" />
            <circle cx="118" cy="82" r="1.5" fill="currentColor" className="text-muted-foreground/20" />
            <circle cx="85" cy="98" r="1.5" fill="currentColor" className="text-muted-foreground/15" />
            <circle cx="130" cy="72" r="1" fill="currentColor" className="text-muted-foreground/15" />
        </svg>
    )
}

// ── Service icon map (used by table & stats) ────────────────────────────────
export const SERVICE_SVG_ICONS: Record<string, React.ComponentType<IconProps>> = {
    hcaptcha: HCaptchaIcon,
    awswaf: AwsWafIcon,
    recaptcha: RecaptchaIcon,
    kbs: KbsIcon,
}
