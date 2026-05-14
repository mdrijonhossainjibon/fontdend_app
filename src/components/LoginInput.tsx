import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** SVG icon element rendered on the left side of the input */
  icon?: ReactNode
  /** Element rendered on the right side (e.g. password toggle) */
  suffix?: ReactNode
  /** Label text shown above the input */
  label?: string
  /** Error message shown below the input */
  error?: string
  /** Full-width mode */
  fullWidth?: boolean
}

const LoginInput = forwardRef<HTMLInputElement, LoginInputProps>(
  ({ className, icon, suffix, label, error, fullWidth, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
      <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground/90"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="group relative">
          {/* Icon */}
          {icon && (
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-20 text-muted-foreground transition-all duration-300 group-focus-within:text-[#F0B90B]">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            data-slot="login-input"
            className={cn(
              // Base
              'relative z-10 flex h-12 w-full rounded-xl border bg-card/50 text-foreground shadow-xs backdrop-blur-sm transition-all duration-300 outline-none',
              'placeholder:text-muted-foreground/40',
              // Focus
              'focus:border-border dark:focus:border-white/20 focus:ring-0',
              // Disabled
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              // Selection
              'selection:bg-[#F0B90B]/20 selection:text-foreground',
              // Border
              error
                ? 'border-destructive focus:border-destructive'
                : 'border-border dark:border-white/10',
              // Padding
              icon ? 'pl-10' : 'px-4',
              suffix || props.type === 'password' ? 'pr-10' : 'pr-4',
              className,
            )}
            {...props}
          />

          {/* Suffix (e.g. password toggle) */}
          {suffix && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-all duration-300 hover:text-[#F0B90B]">
              {suffix}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="animate-slideUp text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  },
)

LoginInput.displayName = 'LoginInput'

export { LoginInput }
export type { LoginInputProps }
