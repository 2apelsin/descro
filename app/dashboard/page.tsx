'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

type UserProfile = {
  id: string
  email: string
  name: string | null
  generations_left: number
  last_reset: string
  pro_until: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('descro_token')

    if (!token) {
      router.push('/')
      return
    }

    // Загружаем профиль
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          router.push('/')
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
            <p className="text-slate-600">Загрузка...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  const isPro = user.pro_until && new Date(user.pro_until) > new Date()
  const proUntil = user.pro_until ? new Date(user.pro_until) : null
  const daysLeft = proUntil ? Math.ceil((proUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Мой аккаунт</h1>
        
        {/* Профиль */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white text-2xl font-bold">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {user.name || 'Пользователь'}
              </h2>
              <p className="text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Подписка */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Подписка</h2>
          
          {isPro ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">PRO подписка активна</h3>
                    <p className="text-slate-600">Безлимитные генерации</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <p className="text-sm text-slate-600">
                    Действует до: <span className="font-semibold">{proUntil?.toLocaleDateString('ru-RU')}</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Осталось: {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🆓</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Бесплатный тариф</h3>
                    <p className="text-slate-600">3 генерации в день</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-lg font-semibold text-slate-900">
                    Осталось сегодня: {user.generations_left} из 3
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Получите PRO</h3>
                <p className="text-lg mb-4 text-white/90">
                  Безлимитные генерации за 199₽/месяц
                </p>
                <Link
                  href="/#pricing"
                  className="block w-full rounded-xl bg-white px-6 py-3 text-center text-lg font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Купить подписку
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
