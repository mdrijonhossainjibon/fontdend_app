"use client"

import { ExternalLink } from "lucide-react"

export function CaptchaMasterEmbed() {
  return (
    <section className="py-16 sm:py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Try CaptchaMaster Now
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Experience our powerful captcha solving extension right in your browser.
            Open the app to see it in action.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-10 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">CaptchaMaster App</span>
          </div>

          <div className="relative bg-background aspect-video min-h-[400px]">
            <iframe
              src="http://localhost:3001"
              className="w-full h-full absolute inset-0"
              title="CaptchaMaster App"
              loading="lazy"
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" id="captchamaster-placeholder">
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <ExternalLink className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Open the CaptchaMaster app to see it in action
                </p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  Run: <code className="bg-muted px-2 py-0.5 rounded">cd CaptchaⱮaster && npm run dev</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
