"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Clock, Zap } from "lucide-react"

export function LiveStats() {
  const [count, setCount] = useState(4847)
  const [recentActivity, setRecentActivity] = useState<string | null>(null)

  const names = ["Алексей", "Мария", "Дмитрий", "Елена", "Игорь", "Анна", "Сергей", "Ольга"]
  const products = [
    "кроссовки",
    "наушники",
    "рюкзак",
    "часы",
    "платье",
    "куртку",
    "телефон",
    "сумку"
  ]

  useEffect(() => {
    // Увеличиваем счетчик каждые 5-15 секунд
    const interval = setInterval(() => {
      setCount(prev => prev + 1)
      
      // Показываем уведомление о новой генерации
      const name = names[Math.floor(Math.random() * names.length)]
      const product = products[Math.floor(Math.random() * products.length)]
      setRecentActivity(`${name} создал описание для "${product}"`)
      
      setTimeout(() => setRecentActivity(null), 4000)
    }, Math.random() * 10000 + 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-blue-50 py-3">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:gap-8">
          {/* Живой счетчик */}
          <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <span className="font-medium text-slate-700">
              <span className="text-emerald-600 font-bold">{count.toLocaleString()}</span> описаний создано
            </span>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* Средняя скорость */}
          <div className="flex items-center gap-2 text-slate-600">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Генерация за 10 сек</span>
          </div>

          <div className="h-4 w-px bg-slate-300" />

          {/* Активность */}
          <div className="flex items-center gap-2 text-slate-600">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>150+ активных продавцов</span>
          </div>
        </div>

        {/* Уведомление о недавней активности */}
        {recentActivity && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="mx-auto max-w-md rounded-lg border border-emerald-200 bg-white px-4 py-2 text-center text-xs text-slate-600 shadow-sm">
              <Clock className="mr-1 inline h-3 w-3 text-emerald-500" />
              {recentActivity}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
