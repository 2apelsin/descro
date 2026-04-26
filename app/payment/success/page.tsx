'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checking, setChecking] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Проверяем статус подписки (НЕ активируем!)
    const checkProStatus = async () => {
      const token = localStorage.getItem('descro_token')
      
      if (!token) {
        setError('Токен не найден')
        setChecking(false)
        return
      }

      try {
        // Просто проверяем текущий статус пользователя
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка проверки статуса')
        }

        const data = await response.json()
        
        // Проверяем, активна ли PRO подписка
        const proUntil = data.user.pro_until ? new Date(data.user.pro_until) : null
        const isProActive = proUntil && proUntil > new Date()
        
        setIsPro(isProActive)
        setChecking(false)
        
        // Если PRO активна, перенаправляем в дашборд через 3 секунды
        if (isProActive) {
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000)
        }
      } catch (err) {
        console.error('Check status error:', err)
        setError('Не удалось проверить статус подписки')
        setChecking(false)
      }
    }

    checkProStatus()
    
    // Проверяем статус каждые 2 секунды (webhook может прийти с задержкой)
    const interval = setInterval(checkProStatus, 2000)
    
    // Останавливаем проверку через 30 секунд
    const timeout = setTimeout(() => {
      clearInterval(interval)
      if (checking) {
        setError('Платеж обрабатывается. Подписка активируется в течение минуты.')
        setChecking(false)
      }
    }, 30000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [router, checking])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-3xl font-bold mb-2">Платеж обрабатывается</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Подписка активируется автоматически после подтверждения оплаты.
            Обычно это занимает несколько секунд.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity"
          >
            Перейти в личный кабинет
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {checking ? (
          <>
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h1 className="text-3xl font-bold mb-2">Проверяем оплату...</h1>
            <p className="text-gray-400">Пожалуйста, подождите</p>
          </>
        ) : isPro ? (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">PRO активирован!</h1>
            <p className="text-gray-400 mb-6">
              Спасибо за оплату. Безлимитный доступ открыт на 30 дней.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity"
            >
              Перейти в личный кабинет
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Автоматическое перенаправление через 3 секунды...
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-3xl font-bold mb-2">Платеж обрабатывается</h1>
            <p className="text-gray-400 mb-6">
              Подписка активируется автоматически после подтверждения оплаты
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity"
            >
              Перейти в личный кабинет
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-6xl animate-pulse">⏳</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
