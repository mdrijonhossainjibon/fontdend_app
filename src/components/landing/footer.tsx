import { Link } from 'react-router-dom'
import { ArrowUpRight } from "lucide-react"

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.168.32.016.091.035.3.019.462z"/>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "API Docs", href: "/api-docs" },
    { label: "Extensions", href: "/extensions" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "Refund Policy", href: "/refund" },
  ],
}
export function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                <img src="/logo.png" alt="CaptchaMaster Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Captcha<span className="text-primary">Ɱaster</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              The world's most advanced AI-powered captcha solving service. Fast, reliable, and completely secure.
            </p>
            <div className="flex gap-4">
              {[
                { icon: TwitterIcon, href: "https://twitter.com/CaptchaMasterBD", color: "hover:text-sky-400" },
                { icon: TelegramIcon, href: "https://t.me/CaptchaMasterBangladesh", color: "hover:text-sky-500" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg bg-card border border-border transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-6">
              <h4 className="font-bold text-foreground uppercase tracking-wider text-xs sm:text-sm">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-sm text-muted-foreground">© 2026 CaptchaⱮaster. All rights reserved.</p>
            <span className="hidden md:inline text-border">|</span>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground font-medium">Systems Operational</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
              <div className="pl-4 text-xs text-muted-foreground flex items-center">
                <span className="font-bold text-foreground mr-1">10k+</span> users trust us
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
