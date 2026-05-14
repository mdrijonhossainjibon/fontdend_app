
export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-40 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center gap-10 px-4">
        {/* Logo or branding area */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent/60 flex items-center justify-center shadow-lg animate-pulse">
          <div className="w-12 h-12 rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-background animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        {/* Animated loader */}
        <div className="relative w-32 h-32">
          {/* Outer ring - rotating */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="141 282"
              style={{
                animation: 'spin 2s linear infinite',
                transformOrigin: 'center'
              }}
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Middle pulsing ring */}
          <div className="absolute inset-4 rounded-full border border-accent/30 animate-pulse" />

          {/* Inner glow */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-lg animate-pulse" style={{ animationDuration: '2s' }} />

          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-3 max-w-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Loading
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            We're preparing everything for you. This won't take long.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-56 h-1 bg-secondary rounded-full overflow-hidden shadow-sm">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundSize: '200% 100%'
            }}
          />
        </div>

        {/* Status dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/50"
              style={{
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
