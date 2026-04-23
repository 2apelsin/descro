"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export function DiscountTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev
        
        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // Сброс таймера
          hours = 23
          minutes = 59
          seconds = 59
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-t border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 py-4">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-slate-900">
              Скидка 33% действует еще:
            </span>
          </div>
          
          <div className="flex gap-2">
            <div className="flex flex-col items-center rounded-lg bg-white px-3 py-2 shadow-sm">
              <span className="text-2xl font-bold text-slate-900">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500">часов</span>
            </div>
            <div className="flex items-center text-2xl font-bold text-slate-400">:</div>
            <div className="flex flex-col items-center rounded-lg bg-white px-3 py-2 shadow-sm">
              <span className="text-2xl font-bold text-slate-900">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500">минут</span>
            </div>
            <div className="flex items-center text-2xl font-bold text-slate-400">:</div>
            <div className="flex flex-col items-center rounded-lg bg-white px-3 py-2 shadow-sm">
              <span className="text-2xl font-bold text-slate-900">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-500">секунд</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
