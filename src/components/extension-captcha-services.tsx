
import { useState, useEffect } from 'react'
import { ExtensionCaptchaCard } from '@/components/extension-captcha-card'
import { Shield, Zap, Lock, Cpu } from 'lucide-react'

const initialServices = [
  {
    name: 'reCAPTCHA v2',
    description: 'Google reCAPTCHA v2',
    icon: <Shield className="w-5 h-5 text-blue-500" />,
    color: '#3B82F6',
    isPopular: true,
    animationDelay: 0,
  },
  {
    name: 'reCAPTCHA v3',
    description: 'Google reCAPTCHA v3',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    color: '#FBBF24',
    isPopular: false,
    animationDelay: 75,
  },
  {
    name: 'hCaptcha',
    description: 'hCaptcha solver',
    icon: <Lock className="w-5 h-5 text-purple-500" />,
    color: '#A855F7',
    isPopular: false,
    animationDelay: 150,
  },
  {
    name: 'Turnstile',
    description: 'Cloudflare Turnstile',
    icon: <Cpu className="w-5 h-5 text-cyan-500" />,
    color: '#06B6D4',
    isPopular: false,
    animationDelay: 225,
  },
]

export function ExtensionCaptchaServices() {
  const [isVisible, setIsVisible] = useState(false)
  const [serviceStates, setServiceStates] = useState<{ [key: string]: boolean }>({
    'reCAPTCHA v2': true,
    'reCAPTCHA v3': true,
    'hCaptcha': false,
    'Turnstile': false,
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleToggle = (serviceName: string, isEnabled: boolean) => {
    setServiceStates((prev) => ({
      ...prev,
      [serviceName]: isEnabled,
    }))
  }

  return (
    <div className="px-4 py-4 bg-white">
      <div
        className={`transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Captcha Services</p>
        <div className="space-y-2">
          {initialServices.map((service) => (
            <ExtensionCaptchaCard
              key={service.name}
              name={service.name}
              description={service.description}
              logo={service.icon}
              isPopular={service.isPopular}
              isActive={serviceStates[service.name]}
              color={service.color}
              animationDelay={service.animationDelay}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
