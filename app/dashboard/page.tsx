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

type Generation = {
  id: string
  title: string
  description: string
  bullets: string[]
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [generationsLoading, setGenerationsLoading] = useState(false)
  const [refundLoading, setRefundLoading] = useState(false)
  const [refundMessage, setRefundMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
          // Загружаем историю генераций
          loadGenerations(token)
        } else {
          router.push('/')
        }
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false))
  }, [router])

  const loadGenerations = async (token: string) => {
    setGenerationsLoading(true)
    try {
      const res = await fetch('/api/generations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setGenerations(data.generations || [])
      }
    } catch (error) {
      console.error('Failed to load generations:', error)
    } finally {
      setGenerationsLoading(false)
    }
  }

  const copyToClipboard = (gen: Generation) => {
    const text = `${gen.title}\n\n${gen.description}\n\n${gen.bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}`
    navigator.clipboard.writeText(text)
    setCopiedId(gen.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteGeneration = async (id: string) => {
    if (!confirm('Удалить эту генерацию?')) return
    
    const token = localStorage.getItem('descro_token')
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setGenerations(generations.filter(g => g.id !== id))
    } catch (error) {
      alert('Ошибка при удалении')
    }
  }

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
        <h1 className="mb-8 text-3xl font-bold text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-500">
          Мой аккаунт
        </h1>
        
        {/* Профиль */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white text-2xl font-bold shadow-lg">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
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

        {/* История генераций */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">История генераций</h2>
          
          {generationsLoading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900 mx-auto" />
              <p className="text-slate-600 mt-2">Загрузка...</p>
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Пока нет сгенерированных описаний</p>
              <Link
                href="/#demo"
                className="mt-4 inline-block text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Создать первое описание →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {generations.map((gen) => (
                <div
                  key={gen.id}
                  className="rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{gen.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(gen.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(gen)}
                        className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 transition-colors"
                      >
                        {copiedId === gen.id ? '✓ Скопировано' : '📋 Копировать'}
                      </button>
                      <button
                        onClick={() => deleteGeneration(gen.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-700">{gen.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {gen.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
