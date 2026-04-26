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
  const [refundLoading, setRefundLoading] = useState(false)
  const [refundMessage, setRefundMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

  const handleRefundRequest = async () => {
    if (!confirm('Вы уверены, что хотите запросить возврат средств? Подписка будет отменена после одобрения.')) {
      return
    }

    setRefundLoading(true)
    setRefundMessage(null)

    try {
      const token = localStorage.getItem('descro_token')
      const response = await fetch('/api/refund/request', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setRefundMessage({ 
          type: 'success', 
          text: data.message || 'Запрос на возврат отправлен' 
        })
      } else {
        setRefundMessage({ 
          type: 'error', 
          text: data.error || 'Ошибка при запросе возврата' 
        })
      }
    } catch (error) {
      setRefundMessage({ 
        type: 'error', 
        text: 'Не удалось отправить запрос' 
      })
    } finally {
      setRefundLoading(false)
    }
  }

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
              {refundMessage && (
                <div className={`rounded-xl p-4 ${
                  refundMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {refundMessage.text}
                </div>
              )}

              <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">PRO подписка активна</h3>
                    <p className="text-emerald-600 font-semibold text-lg">∞ Безлимитные генерации</p>
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
              
              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-600">∞</div>
                  <p className="text-sm text-slate-600 mt-1">Генераций в месяц</p>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
                  <div className="text-3xl font-bold text-slate-900">{daysLeft}</div>
                  <p className="text-sm text-slate-600 mt-1">Дней осталось</p>
                </div>
              </div>

              {/* Кнопка возврата */}
              {daysLeft <= 7 && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Возврат средств</h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Возврат возможен в течение 7 дней после покупки. Запрос обрабатывается вручную в течение 1-3 рабочих дней.
                  </p>
                  <button
                    onClick={handleRefundRequest}
                    disabled={refundLoading}
                    className="w-full rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 disabled:opacity-50 transition-colors"
                  >
                    {refundLoading ? 'Отправка...' : 'Запросить возврат'}
                  </button>
                </div>
              )}
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
