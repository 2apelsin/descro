"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowRight, Copy, AlertCircle, Sparkles, RotateCcw, Check, Loader2 } from "lucide-react"
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
  const [typingIndex, setTypingIndex] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [enhancing, setEnhancing] = useState(false)
  const [remaining, setRemaining] = useState(3)
  const [showPaywall, setShowPaywall] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Загрузка лимита из localStorage и проверка PRO статуса
  useEffect(() => {
    const token = localStorage.getItem('descro_token')
    
    // Проверяем PRO статус если есть токен
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            const proUntil = data.user.pro_until ? new Date(data.user.pro_until) : null
            const isProActive = !!(proUntil && proUntil > new Date())
            
            setIsPro(isProActive)
            setRemaining(data.user.generations_left)
            
            if (!isProActive && data.user.generations_left <= 0) {
              setShowPaywall(true)
            }
          }
        })
        .catch(err => console.error('Failed to fetch user:', err))
    } else {
      // Локальный лимит для неавторизованных
      const saved = localStorage.getItem('descro_remaining')
      const resetAt = localStorage.getItem('descro_reset_at')
      const now = Date.now()

      if (resetAt && now - parseInt(resetAt) > 24 * 60 * 60 * 1000) {
        localStorage.setItem('descro_remaining', '3')
        localStorage.setItem('descro_reset_at', now.toString())
        setRemaining(3)
      } else if (saved) {
        const count = parseInt(saved)
        setRemaining(count)
        if (count <= 0) setShowPaywall(true)
      } else {
        localStorage.setItem('descro_remaining', '3')
        localStorage.setItem('descro_reset_at', now.toString())
      }
    }
  }, [])

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

    // Проверяем лимит только если не PRO
    if (!isPro && remaining <= 0) {
      setShowPaywall(true)
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
      const token = localStorage.getItem('descro_token')
      const headers: HeadersInit = { "Content-Type": "application/json" }
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, category, features, marketplace }),
      })
      const data = await res.json()
      
      clearInterval(progressInterval)
      clearInterval(textInterval)
      setProgress(100)
      
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Ошибка генерации")
      
      setTimeout(() => {
        setResult(data.data as GenerationResult)
        setLoading(false)
        localStorage.setItem("descro_last_result", JSON.stringify(data.data))
        
        // Уменьшаем счётчик только если не PRO
        if (!isPro) {
          const newRemaining = remaining - 1
          setRemaining(newRemaining)
          
          if (!token) {
            localStorage.setItem('descro_remaining', newRemaining.toString())
          }
          
          if (newRemaining <= 0) {
            setShowPaywall(true)
          }
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
      setToast({ message: "Скопировано!", type: "success" })
    } catch {
      setToast({ message: "Ошибка копирования", type: "error" })
    }
  }

  function copyTitle() {
    if (result) {
      copy(result.title, "title")
    }
  }

  function copyDescription() {
    if (result) {
      const text = `${result.description}\n\n${result.bullets.map((b) => `• ${b}`).join("\n")}${result.keywords ? `\n\nКлючевые слова: ${result.keywords}` : ""}`
      copy(text, "description")
    }
  }

  function copyAll() {
    if (result) {
      const text = `${result.title}\n\n${result.description}\n\n${result.bullets.map((b) => `• ${b}`).join("\n")}${result.keywords ? `\n\nКлючевые слова: ${result.keywords}` : ""}`
      copy(text, "all")
    }
  }

  function regenerate() {
    if (name) {
      const form = document.querySelector("form") as HTMLFormElement
      form?.requestSubmit()
    }
  }

  async function enhanceFeatures() {
    if (!name) {
      setToast({ message: "Сначала введите название товара", type: "error" })
      return
    }
    
    setEnhancing(true)
    
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, features }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Ошибка улучшения")
      }
      
      setFeatures(data.enhanced)
      setToast({ message: "✨ Характеристики улучшены с помощью AI!", type: "success" })
    } catch (error) {
      console.error("Enhance error:", error)
      setToast({ message: "Не удалось улучшить характеристики", type: "error" })
    } finally {
      setEnhancing(false)
    }
  }

  async function createPayment(plan: string) {
    const token = localStorage.getItem('descro_token')
    
    if (!token) {
      setToast({ message: "Сначала войдите через Telegram", type: "error" })
      return
    }
    
    if (!agreedToTerms) {
      setToast({ message: "Необходимо принять условия оферты", type: "error" })
      return
    }
    
    setCreatingPayment(true)
    
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка создания платежа')
      }
      
      // Перенаправляем на страницу оплаты
      window.location.href = data.paymentUrl
    } catch (error) {
      console.error('Payment error:', error)
      setToast({ message: 'Не удалось создать платёж', type: 'error' })
    } finally {
      setCreatingPayment(false)
    }
  }

  const titleLength = result?.title.length || 0
  const descLength = result?.description.length || 0
  const limits = CHAR_LIMITS[marketplace]

  return (
    <div className="space-y-6">
      {/* Форма с glassmorphism */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8 shadow-2xl">
        {/* Хедер */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">Генератор описаний</h2>
          <p className="text-sm text-white/60">Создавайте продающие тексты для маркетплейсов</p>
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
              {name && (
                <button
                  type="button"
                  onClick={enhanceFeatures}
                  disabled={enhancing || loading}
                  className="flex items-center gap-1 text-xs text-white/60 hover:text-white/80 disabled:opacity-50"
                >
                  {enhancing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Улучшаем...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      Улучшить с AI
                    </>
                  )}
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
            disabled={loading || !name.trim() || (!isPro && remaining <= 0)}
            className="h-11 w-full rounded-xl bg-white text-slate-900 hover:bg-white/90 disabled:opacity-50 font-medium"
          >
            {loading ? (
              loadingText
            ) : !isPro && remaining <= 0 ? (
              "Лимит исчерпан"
            ) : (
              <>
                Сгенерировать
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          {/* Счётчик генераций */}
          <div className="text-center">
            {isPro ? (
              <p className="text-sm text-emerald-400">
                ✨ PRO активен — безлимитные генерации
              </p>
            ) : (
              <p className={cn(
                "text-sm",
                remaining === 0 ? "text-red-400" : remaining === 1 ? "text-yellow-400" : "text-white/60"
              )}>
                {remaining === 0 ? "Лимит исчерпан" : `Осталось ${remaining} из 3 бесплатных генераций`}
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Paywall */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative mx-4 max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute right-4 top-4 text-white/60 hover:text-white"
            >
              ✕
            </button>
            
            <div className="mb-4 text-5xl">🔥</div>
            <h3 className="mb-2 text-2xl font-bold text-white">Бесплатный лимит исчерпан</h3>
            <p className="mb-6 text-white/70">
              Вы использовали все 3 бесплатные генерации сегодня
            </p>
            
            <div className="mb-6 space-y-3">
              {/* Первый месяц со скидкой */}
              <div className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-4 border border-emerald-500/20">
                <div className="mb-2 text-3xl font-bold text-white">
                  <span className="text-emerald-400">199₽</span>
                  <span className="ml-2 text-lg text-white/60 line-through">299₽</span>
                </div>
                <p className="text-sm text-white/80 mb-3">Первый месяц со скидкой 33%</p>
                <button
                  onClick={() => createPayment('pro-first')}
                  disabled={creatingPayment}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {creatingPayment ? 'Создаём платёж...' : 'Получить PRO со скидкой'}
                </button>
              </div>

              {/* Обычная цена */}
              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <div className="mb-2 text-2xl font-bold text-white">299₽</div>
                <p className="text-sm text-white/60 mb-3">Обычная цена за месяц</p>
                <button
                  onClick={() => createPayment('pro')}
                  disabled={creatingPayment}
                  className="w-full rounded-xl bg-white/10 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                  {creatingPayment ? 'Создаём платёж...' : 'Купить PRO'}
                </button>
              </div>
            </div>

            <div className="mb-4 space-y-2 text-left">
              <p className="text-xs text-white/60 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Безлимитные генерации
              </p>
              <p className="text-xs text-white/60 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Приоритетная поддержка
              </p>
              <p className="text-xs text-white/60 flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Доступ ко всем маркетплейсам
              </p>
            </div>

            {/* Галочка согласия */}
            <div className="mb-4 flex items-start gap-2 text-left">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="terms" className="text-xs text-white/70 cursor-pointer">
                Я ознакомлен и принимаю условия{" "}
                <a href="/oferta" target="_blank" className="text-emerald-400 hover:underline">
                  Публичной оферты
                </a>
                {" "}и{" "}
                <a href="/privacy" target="_blank" className="text-emerald-400 hover:underline">
                  Политики конфиденциальности
                </a>
              </label>
            </div>
            
            <p className="mt-4 text-xs text-white/50">
              Лимит обновится через {Math.ceil((24 * 60 * 60 * 1000 - (Date.now() - parseInt(localStorage.getItem('descro_reset_at') || '0'))) / (60 * 60 * 1000))} ч
            </p>
          </div>
        </div>
      )}

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

          {/* Ключевые слова */}
          {result.keywords && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                Ключевые слова
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.split(",").map((keyword, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 text-xs font-medium text-purple-700"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Кнопки копирования */}
          <div className="grid gap-3 md:grid-cols-3">
            <button
              onClick={copyTitle}
              className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              Копировать заголовок
            </button>
            <button
              onClick={copyDescription}
              className="rounded-xl border-2 border-purple-200 bg-purple-50 px-4 py-3 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
            >
              Копировать описание
            </button>
            <button
              onClick={copyAll}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              <Check className="h-4 w-4" />
              Копировать всё
            </button>
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

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
