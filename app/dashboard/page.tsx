'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

type UserProfile = {
  telegram_id: number
  username: string | null
  first_name: string | null
  generations_left: number
  last_reset: string
  pro_until: string | null
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [generations, setGenerations] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('descro_token')
    
    if (!token) {
      router.push('/')
      return
    }

    // Загружаем профиль
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          router.push('/')
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))

    // Загружаем историю генераций
    fetch('/api/generations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGenerations(data.generations || [])
        }
      })
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
      
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Личный кабинет</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Профиль */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white text-xl font-bold">
                {user.first_name?.[0] || user.username?.[0] || 'U'}
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">{user.first_name || user.username}</h2>
                <p className="text-sm text-slate-500">@{user.username || 'user'}</p>
              </div>
            </div>
            
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div>
                <p className="text-xs text-slate-500">Telegram ID</p>
                <p className="font-mono text-sm text-slate-900">{user.telegram_id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Дата регистрации</p>
                <p className="text-sm text-slate-900">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>

          {/* Подписка */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:col-span-2">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Подписка</h2>
            
            {isPro ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⭐</span>
                    <h3 className="text-lg font-semibold text-slate-900">PRO активен</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Безлимитные генерации до {proUntil?.toLocaleDateString('ru-RU')}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Осталось {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 mb-1">Генераций использовано</p>
                    <p className="text-2xl font-bold text-slate-900">∞</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500 mb-1">Статус</p>
                    <p className="text-2xl font-bold text-emerald-600">PRO</p>
                  </div>
                </div>

                <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Отменить автопродление
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🆓</span>
                    <h3 className="text-lg font-semibold text-slate-900">Бесплатный тариф</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {user.generations_left} из 3 генераций осталось сегодня
                  </p>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Получите PRO</h3>
                  <p className="text-sm mb-4 text-white/90">
                    Безлимитные генерации за 199₽ первый месяц
                  </p>
                  <Link
                    href="/#pricing"
                    className="block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    Активировать PRO
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* История генераций */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">История генераций</h2>
          
          {generations.length > 0 ? (
            <div className="space-y-3">
              {generations.slice(0, 10).map((gen) => (
                <div key={gen.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{gen.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(gen.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Повторить
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">У вас пока нет генераций</p>
              <Link
                href="/#demo"
                className="inline-block rounded-lg bg-slate-900 px-6 py-2 text-white hover:bg-slate-800"
              >
                Создать первую генерацию
              </Link>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
