"use client"

import { useState, useEffect } from "react"
import { Zap, RotateCcw, Calendar } from "lucide-react"

export function ExtensionStats() {
  const [isVisible, setIsVisible] = useState(false)
  const [refillTime, setRefillTime] = useState({ hours: 18, minutes: 7, seconds: 0 })
  const [expiresTime, setExpiresTime] = useState({ hours: 21, minutes: 7, seconds: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Real-time countdown update
  useEffect(() => {
    const countdown = setInterval(() => {
      setRefillTime((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 23
            }
          }
        }
        return { hours, minutes, seconds }
      })

      setExpiresTime((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
          if (minutes < 0) {
            minutes = 59
            hours--
            if (hours < 0) {
              hours = 0
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [])

  const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
    return `${String(time.hours).padStart(2, '0')}:${String(time.minutes).padStart(2, '0')}:${String(time.seconds).padStart(2, '0')}`
  }

  // Determine border color based on time remaining - using SparkAI brand yellow
  const getRefillBorderColor = () => {
    const totalSeconds = refillTime.hours * 3600 + refillTime.minutes * 60 + refillTime.seconds
    if (totalSeconds < 1800) return "border-red-300/60" // Less than 30 min
    if (totalSeconds < 3600) return "border-amber-300/60" // Less than 1 hour
    return "border-amber-200/40"
  }

  const getExpiresBorderColor = () => {
    const totalSeconds = expiresTime.hours * 3600 + expiresTime.minutes * 60 + expiresTime.seconds
    if (totalSeconds < 3600) return "border-red-300/60" // Less than 1 hour
    if (totalSeconds < 86400) return "border-amber-300/60" // Less than 24 hours
    return "border-amber-200/40"
  }

  return (
    <div className={`px-4 py-3 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex gap-2.5">
        {/* Daily Limit */}
        <div className="flex-1 p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/40 hover:border-amber-300/50 transition-all">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100/70">
              <Zap className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Daily Limit</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-bold text-slate-900">450</p>
            <span className="text-xs text-slate-600">/</span>
            <p className="text-xs font-medium text-slate-600">1000</p>
          </div>
        </div>

        {/* Refill - 24h Countdown */}
        <div className={`flex-1 p-3.5 rounded-lg bg-amber-50/60 border transition-all ${getRefillBorderColor()} hover:border-amber-300/50`}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100/70">
              <RotateCcw className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Refill</span>
          </div>
          <p className="text-lg font-bold text-cyan-500">{formatTime(refillTime)}</p>
          <p className="text-[8px] text-amber-700/60 mt-1">Next reset</p>
        </div>

        {/* Expires - Package Countdown */}
        <div className={`flex-1 p-3.5 rounded-lg bg-amber-50/60 border transition-all ${getExpiresBorderColor()} hover:border-amber-300/50`}>
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100/70">
              <Calendar className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Exp</span>
          </div>
          <p className="text-lg font-bold text-cyan-500">{formatTime(expiresTime)}</p>
          <p className="text-[8px] text-amber-700/60 mt-1">Until expire</p>
        </div>
      </div>
    </div>
  )
}
