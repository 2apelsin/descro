'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import Link from 'next/link'

// Отключаем SSR для этой страницы
export const dynamic = 'force-dynamic'

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Инициализируем Supabase клиент на клиенте
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      setSupabase(client)
    }
  }, [])

  useEffect(() => {
    if (supabase) {
      checkAuth()
    }
  }, [supabase])

  const checkAuth = async () => {
    if (!supabase) return
    
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profile)
    }
  }

  const handlePurchase = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в аккаунт')
      return
    }

    if (!supabase) {
      alert('Ошибка инициализации')
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      })

      const data = await response.json()

      if (data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        alert('Ошибка создания платежа')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Ошибка создания платежа')
    } finally {
      setLoading(false)
    }
  }

  const isPro = profile?.pro_until && new Date(profile.pro_until) > new Date()

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Выберите свой план
          </h1>
          <p className="text-xl text-gray-400 text-center mb-12">
            Начните бесплатно или получите безлимитный доступ
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Бесплатный план */}
            <div className="bg-[#16161e] rounded-2xl p-8 border border-[#333]">
              <h3 className="text-2xl font-bold text-white mb-2">Бесплатно</h3>
              <div className="text-4xl font-bold text-white mb-6">
                0 ₽
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-gray-300">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 генерации в день
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Базовое качество
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Все основные функции
                </li>
              </ul>

              <Link
                href="/"
                className="block w-full px-6 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#222] transition-colors text-center border border-[#333]"
              >
                Попробовать бесплатно
              </Link>
            </div>

            {/* PRO план */}
            <div className="bg-gradient-to-br from-[#7c3aed]/20 to-[#3b82f6]/20 rounded-2xl p-8 border-2 border-[#7c3aed] relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white text-sm font-bold px-3 py-1 rounded-full">
                Популярно
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
              <div className="text-4xl font-bold text-white mb-1">
                299 ₽
                <span className="text-lg text-gray-400 font-normal">/месяц</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">≈ 10 ₽ в день</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-white">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Безлимитные генерации
                </li>
                <li className="flex items-start gap-3 text-white">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Максимальное качество
                </li>
                <li className="flex items-start gap-3 text-white">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Приоритетная поддержка
                </li>
                <li className="flex items-start gap-3 text-white">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Ранний доступ к новым функциям
                </li>
              </ul>

              {isPro ? (
                <div className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-xl text-center">
                  ✓ Активно до {new Date(profile.pro_until).toLocaleDateString('ru-RU')}
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-500/50"
                >
                  {loading ? 'Загрузка...' : 'Оформить PRO'}
                </button>
              )}
            </div>
          </div>

          {/* Гарантии */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              💳 Безопасная оплата через ЮKassa
            </p>
            <p className="text-sm text-gray-500">
              Отменить подписку можно в любой момент
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
