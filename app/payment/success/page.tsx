'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем в дашборд через 3 секунды
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
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
      </div>
    </div>
  )
}
