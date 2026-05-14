export function LoadingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Animated loader circle */}
        <div className="relative w-24 h-24">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/50 animate-spin" style={{ animationDuration: '2s' }} />
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-3 rounded-full border border-accent/30 animate-pulse" />
          
          {/* Inner glow circle */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-md animate-pulse-glow" />
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Loading
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              We're preparing everything for you. This should only take a moment.
            </p>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
            style={{
              animation: 'shimmer 1.5s ease-in-out infinite',
              backgroundSize: '200% 100%'
            }}
          />
        </div>

        {/* Status indicators */}
        <div className="flex gap-3 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              style={{
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
                backgroundColor: i === 0 ? 'var(--primary)' : undefined
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
