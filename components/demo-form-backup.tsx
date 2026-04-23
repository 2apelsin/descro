"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, Copy, AlertCircle, Sparkles, RotateCcw, Check, Loader2 } from "lucide-react"
import { fireConfetti } from "@/lib/confetti"
import { Toast } from "@/components/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type GenerationResult = {
  title: string
  description: string
  bullets: string[]
  keywords?: string
}

type Marketplace = "ozon" | "wildberries" | "yandex"

const DAILY_LIMIT = 3
const STORAGE_KEY = "descro_free_generations"
const RESET_KEY = "descro_free_reset_at"

const CHAR_LIMITS = {
  ozon: { title: 120, description: 4000 },
  wildberries: { title: 60, description: 5000 },
  yandex: { title: 120, description: 3000 },
}

const marketplaces = [
  { id: "ozon" as Marketplace, name: "Ozon", color: "bg-blue-500" },
  { id: "wildberries" as Marketplace, name: "Wildberries", color: "bg-purple-500" },
  { id: "yandex" as Marketplace, name: "Яндекс", color: "bg-red-500" },
]

const examples = [
  { name: "Беспроводные наушники TWS Pro", category: "Электроника", features: "Шумоподавление ANC, 30 часов работы, Bluetooth 5.3, влагозащита IPX7" },
  { name: "Кроссовки для бега мужские", category: "Обувь", features: "Дышащий материал, амортизация, размер 42, белый цвет" },
]

export function DemoForm() {
  const [marketplace, setMarketplace] = useState<Marketplace>("ozon")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [features, setFeatures] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Анализируем товар...")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(DAILY_LIMIT)
  const [typingIndex, setTypingIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Инициализация счетчика при загрузке
  useEffect(() => {
    initializeCounter()
  }, [])

  function initializeCounter() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const resetAt = localStorage.getItem(RESET_KEY)
      const now = Date.now()

      // Проверяем, прошло ли 24 часа
      if (resetAt) {
        const resetTime = parseInt(resetAt, 10)
        if (now - resetTime > 24 * 60 * 60 * 1000) {
          // Прошло 24 часа - сбрасываем счетчик
          localStorage.setItem(STORAGE_KEY, String(DAILY_LIMIT))
          localStorage.setItem(RESET_KEY, String(now))
          setRemaining(DAILY_LIMIT)
          return
        }
      } else {
        // Первый запуск - устанавливаем время сброса
        localStorage.setItem(RESET_KEY, String(now))
      }

      // Читаем текущее значение
      if (stored) {
        const count = parseInt(stored, 10)
        setRemaining(isNaN(count) ? DAILY_LIMIT : Math.max(0, count))
      } else {
        localStorage.setItem(STORAGE_KEY, String(DAILY_LIMIT))
        setRemaining(DAILY_LIMIT)
      }
    } catch (err) {
      console.error("localStorage error:", err)
      setRemaining(DAILY_LIMIT)
    }
  }

  function decrementCounter() {
    const newRemaining = Math.max(0, remaining - 1)
    setRemaining(newRemaining)
    try {
      localStorage.setItem(STORAGE_KEY, String(newRemaining))
    } catch (err) {
      console.error("localStorage error:", err)
    }
  }

  useEffect(() => {
    if (result && !showResult && typingIndex < 100) {
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1)
      }, 20)
      return () => clearTimeout(timer)
    } else if (typingIndex >= 100) {
      setShowResult(true)
    }
  }, [result, typingIndex, showResult])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (remaining <= 0) {
      setError("Лимит исчерпан. Оформите Pro для безлимита.")
      return
    }

    setError(null)
    setResult(null)
    setShowResult(false)
    setTypingIndex(0)
    setLoading(true)
    setProgress(0)
    
    const loadingTexts = [
      "Анализируем товар...",
      "Изучаем топ-карточки конкурентов...",
      "Подбираем SEO-ключи...",
      "Генерируем описание...",
    ]
    
    let textIndex = 0
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length
      setLoadingText(loadingTexts[textIndex])
    }, 1500)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => prev >= 90 ? 90 : prev + 10)
    }, 200)
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, features, marketplace }),
      })
      const data = await res.json()
      
      clearInterval(progressInterval)
      clearInterval(textInterval)
      setProgress(100)
      
      if (!res.ok) throw new Error(data?.error ?? "Ошибка генерации")
      
      setTimeout(() => {
        setResult(data as GenerationResult)
        setLoading(false)
        localStorage.setItem("descro_last_result", JSON.stringify(data))
        
        // 🎉 КОНФЕТТИ!
        fireConfetti()
        
        const today = new Date().toDateString()
        const stored = localStorage.getItem("descro_usage")
        if (stored) {
          const usage = JSON.parse(stored)
          const newCount = usage.count + 1
          localStorage.setItem("descro_usage", JSON.stringify({ date: today, count: newCount }))
          setRemaining(Math.max(0, DAILY_LIMIT - newCount))
        }
      }, 300)
    } catch (err) {
      clearInterval(progressInterval)
      clearInterval(textInterval)
      setError(err instanceof Error ? err.message : "Ошибка генерации")
      setLoading(false)
      setProgress(0)
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {}
  }

  function regenerate() {
    if (name) {
      const form = document.querySelector("form") as HTMLFormElement
      form?.requestSubmit()
    }
  }

  function enhanceFeatures() {
    if (!name) return
    const enhanced = `${features}\n\nВысокое качество, современный дизайн, надежность, быстрая доставка по России`
    setFeatures(enhanced.trim())
  }

  const titleLength = result?.title.length || 0
  const descLength = result?.description.length || 0
  const limits = CHAR_LIMITS[marketplace]

  return (
    <div className="space-y-6">
      {/* Форма с glassmorphism */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8 shadow-2xl">
        {/* Хедер */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Попробуйте бесплатно</h2>
            <p className="text-sm text-white/60">Без регистрации</p>
          </div>
          <div className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium",
            remaining > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {remaining > 0 ? `${remaining} из ${DAILY_LIMIT}` : "Лимит"}
          </div>
        </div>

        {/* Выбор маркетплейса */}
        <div className="mb-6">
          <Label className="mb-3 block text-sm text-white/80">Маркетплейс</Label>
          <div className="flex gap-2">
            {marketplaces.map((mp) => (
              <button
                key={mp.id}
                type="button"
                onClick={() => setMarketplace(mp.id)}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                  marketplace === mp.id
                    ? "border-white/20 bg-white/10 text-white shadow-lg"
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                <div className={cn("mx-auto mb-1 h-2 w-2 rounded-full", mp.color)} />
                {mp.name}
              </button>
            ))}
          </div>
        </div>

        {/* Примеры */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-xs text-white/50">Попробуйте:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setName(ex.name)
                setCategory(ex.category)
                setFeatures(ex.features)
              }}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/10"
            >
              {ex.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-white/80">Название товара</Label>
              <Input
                id="name"
                placeholder="Кеды белые кожаные мужские"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={200}
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-white/80">Категория</Label>
              <Input
                id="category"
                placeholder="Обувь"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={120}
                className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="features" className="text-sm text-white/80">Характеристики</Label>
              {name && features.length < 50 && (
                <button
                  type="button"
                  onClick={enhanceFeatures}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80"
                >
                  <Sparkles className="h-3 w-3" />
                  Улучшить
                </button>
              )}
            </div>
            <Textarea
              id="features"
              placeholder="Натуральная кожа, размер 42, белый цвет, удобная подошва..."
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={3}
              maxLength={1500}
              className="resize-none rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-white/20 focus:bg-white/10"
            />
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>{loadingText}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !name.trim() || remaining <= 0}
            className="h-11 w-full rounded-xl bg-white text-slate-900 hover:bg-white/90 disabled:opacity-50 font-medium"
          >
            {loading ? (
              loadingText
            ) : (
              <>
                Сгенерировать
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                {remaining <= 0 && (
                  <a href="#pricing" className="mt-1 inline-block font-medium underline hover:no-underline">
                    Получить PRO за 199₽ →
                  </a>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Скелетон загрузки */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white/5 p-5 backdrop-blur-xl">
              <div className="mb-3 h-3 w-24 rounded bg-white/10" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-white/10" />
                <div className="h-4 w-3/4 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Результат */}
      {result && !loading && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Готово</h3>
            <div className="flex gap-2">
              <button
                onClick={regenerate}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" />
                Другой вариант
              </button>
              <button
                onClick={() => copy(`${result.title}\n\n${result.description}\n\n${result.bullets.map(b => `• ${b}`).join("\n")}`, "all")}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
              >
                {copied === "all" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Скопировать всё
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Заголовок */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">Заголовок</span>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs",
                  titleLength > limits.title ? "text-red-400" : "text-white/50"
                )}>
                  {titleLength}/{limits.title}
                </span>
                <button
                  onClick={() => copy(result.title, "title")}
                  className="text-xs text-white/60 hover:text-white/80 transition-colors"
                >
                  {copied === "title" ? "✓" : "Копировать"}
                </button>
              </div>
            </div>
            {titleLength > limits.title && (
              <div className="mb-2 text-xs text-red-400">
                ⚠️ Превышен лимит для {marketplaces.find(m => m.id === marketplace)?.name}
              </div>
            )}
            <p className="text-base font-medium leading-snug text-white">
              {showResult ? result.title : result.title.slice(0, Math.floor(result.title.length * typingIndex / 100))}
              {!showResult && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* Буллеты */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">Преимущества</span>
              <button
                onClick={() => copy(result.bullets.map(b => `• ${b}`).join("\n"), "bullets")}
                className="text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                {copied === "bullets" ? "✓ Скопировано" : "Копировать"}
              </button>
            </div>
            <ul className="space-y-2">
              {result.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  <span>{showResult ? bullet : bullet.slice(0, Math.floor(bullet.length * typingIndex / 100))}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Описание */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">Описание</span>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs",
                  descLength > limits.description ? "text-red-400" : "text-white/50"
                )}>
                  {descLength}/{limits.description}
                </span>
                <button
                  onClick={() => copy(result.description, "description")}
                  className="text-xs text-white/60 hover:text-white/80 transition-colors"
                >
                  {copied === "description" ? "✓" : "Копировать"}
                </button>
              </div>
            </div>
            {descLength > limits.description && (
              <div className="mb-2 text-xs text-red-400">
                ⚠️ Превышен лимит для {marketplaces.find(m => m.id === marketplace)?.name}
              </div>
            )}
            <p className="text-sm leading-relaxed text-white/70">
              {showResult ? result.description : result.description.slice(0, Math.floor(result.description.length * typingIndex / 100))}
              {!showResult && <span className="animate-pulse">|</span>}
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center backdrop-blur-xl">
            <p className="text-sm font-medium text-white">
              Понравилось? <span className="text-emerald-400">Первый месяц 199₽</span> вместо 299₽
            </p>
            <a href="#pricing" className="mt-1 inline-block text-xs text-white/70 hover:text-white/90">
              Получить скидку 33% →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
