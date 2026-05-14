"use client"

interface PricingToggleProps {
  isAnnual: boolean
  onToggle: (value: boolean) => void
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span
        className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}
      >
        Monthly
      </span>
      <button
        onClick={() => onToggle(!isAnnual)}
        className="relative w-14 h-7 bg-secondary rounded-full transition-colors hover:bg-secondary/80"
      >
        <div
          className={`
            absolute top-1 w-5 h-5 bg-primary rounded-full transition-all duration-300 shadow-md
            ${isAnnual ? "left-8" : "left-1"}
          `}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}
      >
        Annual
        <span className="ml-1.5 text-xs text-primary font-semibold">Save 20%</span>
      </span>
    </div>
  )
}
