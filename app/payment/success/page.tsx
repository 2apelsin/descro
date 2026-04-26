'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activating, setActivating] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Активируем подписку
    const activatePro = async () => {
      const token = localStorage.getItem('descro_token')
      
      if (!token) {
        setError('Токен не найден')
        setActivating(false)
        return
      }

      try {
        const response = await fetch('/api/payment/activate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка активации')
        }

        setActivating(false)
        
        // Перенаправляем в дашборд через 2 секунды
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } catch (err) {
        console.error('Activation error:', err)
        setError('Не удалось активировать подписку')
        setActivating(false)
      }
    }

    activatePro()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">Ошибка активации</h1>
          <p className="text-gray-400 mb-6">{error}</p>
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
        {activating ? (
          <>
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h1 className="text-3xl font-bold mb-2">Активируем подписку...</h1>
            <p className="text-gray-400">Пожалуйста, подождите</p>
          </>
        ) : (
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
              Автоматическое перенаправление через 2 секунды...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
