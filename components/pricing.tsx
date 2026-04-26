'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"

const plans = [
  {
    name: "Бесплатно",
    price: "0 ₽",
    description: "Попробуйте без регистрации",
    features: ["3 описания в день", "Все функции", "Поддержка маркетплейсов"],
    cta: "Попробовать",
    href: "#demo",
  },
  {
    name: "Pro",
    price: "199 ₽",
    originalPrice: "299 ₽",
    period: "/первый месяц",
    description: "Затем 299₽/мес, можно отменить",
    features: ["Безлимитные описания", "Приоритетная генерация", "История карточек", "Email поддержка"],
    cta: "Получить скидку",
    href: "/pricing",
    popular: true,
    badge: "Скидка 33%",
  },
]

export function Pricing() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('descro_token')
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUser(data.user)
          }
        })
        .catch(() => {})
    }
  }, [])

  const handleFreePlanClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      // Если не авторизован - показываем модалку (через событие)
      window.dispatchEvent(new CustomEvent('openAuthModal'))
    } else {
      // Если авторизован - скроллим к демо
      const demoSection = document.getElementById('demo')
      if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleProPlanClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!user) {
      // Если не авторизован - показываем модалку
      window.dispatchEvent(new CustomEvent('openAuthModal'))
      return
    }

    // Проверяем, есть ли уже PRO
    const isPro = user.pro_until && new Date(user.pro_until) > new Date()
    
    if (isPro) {
      const proUntil = new Date(user.pro_until).toLocaleDateString('ru-RU')
      alert(`PRO подписка уже активна до ${proUntil}`)
      return
    }

    // Создаем платеж
    setLoading(true)
    try {
      const token = localStorage.getItem('descro_token')
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok && data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        alert(data.error || 'Ошибка создания платежа')
      }
    } catch (error) {
      alert('Ошибка создания платежа')
    } finally {
      setLoading(false)
    }
  }
  return (
    <section id="pricing" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Простые тарифы
          </h2>
          <p className="text-lg text-slate-600">
            Начните бесплатно, перейдите на Pro со скидкой 33%
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`card-3d relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-slate-900 bg-slate-900 text-white shadow-2xl scale-105"
                  : "border-slate-200 bg-white"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-lg animate-pulse-glow">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.originalPrice && (
                    <span className={`text-xl line-through ${plan.popular ? "text-white/40" : "text-slate-400"}`}>
                      {plan.originalPrice}
                    </span>
                  )}
                  {plan.period && <span className={`text-sm ${plan.popular ? "opacity-70" : "text-slate-600"}`}>{plan.period}</span>}
                </div>
                <p className={plan.popular ? "text-white/70" : "text-slate-600"}>{plan.description}</p>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm">
                    <span className={plan.popular ? "text-emerald-400" : "text-emerald-600"}>✓</span>
                    <span className={plan.popular ? "text-white/90" : "text-slate-700"}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={plan.name === 'Бесплатно' ? handleFreePlanClick : handleProPlanClick}
                disabled={loading && plan.popular}
                className={`btn-glow block w-full rounded-xl py-3 text-center font-medium transition-all disabled:opacity-50 ${
                  plan.popular
                    ? "bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 animate-pulse-glow"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:scale-105"
                }`}
              >
                {loading && plan.popular ? 'Загрузка...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-600">
            Оплата картой российских банков. Можно отменить в любой момент.
          </p>
          <p className="text-xs text-slate-500">
            После первого месяца — 299₽/мес. Скидка действует только для новых пользователей.
          </p>
        </div>
      </div>
    </section>
  )
}
