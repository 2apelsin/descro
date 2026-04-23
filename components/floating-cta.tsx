"use client"

import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

export function FloatingCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Показываем после прокрутки 50% страницы
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setVisible(scrollPercent > 50 && !dismissed)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dismissed])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="relative rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 shadow-2xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <p className="font-bold">Первый месяц 199₽</p>
            <p className="text-sm text-white/90">Вместо 299₽</p>
          </div>
        </div>
        
        <a
          href="#pricing"
          className="mt-3 block rounded-lg bg-white px-4 py-2 text-center font-medium text-emerald-600 transition-transform hover:scale-105"
        >
          Получить скидку →
        </a>
      </div>
    </div>
  )
}
