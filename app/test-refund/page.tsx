'use client'

import { useState } from 'react'

export default function TestRefundPage() {
  const [email, setEmail] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCancelByEmail = async () => {
    if (!email) {
      setResult('❌ Введите email')
      return
    }

    setLoading(true)
    setResult('⏳ Отменяем подписку...')

    try {
      const response = await fetch('/api/admin/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(`✅ Подписка отменена для ${email}. Восстановлено 3 генерации.`)
      } else {
        setResult(`❌ Ошибка: ${data.error}`)
      }
    } catch (error: any) {
      setResult(`❌ Ошибка: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateRefund = async () => {
    if (!paymentId) {
      setResult('❌ Введите payment_id')
      return
    }

    setLoading(true)
    setResult('⏳ Симулируем возврат...')

    try {
      const response = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'refund.succeeded',
          object: {
            id: 'test-refund-' + Date.now(),
            payment_id: paymentId,
            amount: { value: '1.00', currency: 'RUB' },
            status: 'succeeded',
          },
        }),
      })

      if (response.ok) {
        setResult(`✅ Webhook вызван для payment_id: ${paymentId}. Проверьте логи Railway.`)
      } else {
        setResult(`❌ Ошибка webhook`)
      }
    } catch (error: any) {
      setResult(`❌ Ошибка: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Тест возврата средств</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Метод 1: Отмена по email</h2>
          <p className="text-gray-600 mb-4">
            Отменяет подписку напрямую через базу данных
          </p>
          <input
            type="email"
            placeholder="Email пользователя"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleCancelByEmail}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? '⏳ Отменяем...' : '❌ Отменить подписку'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Метод 2: Симуляция webhook</h2>
          <p className="text-gray-600 mb-4">
            Вызывает webhook с событием refund.succeeded
          </p>
          <input
            type="text"
            placeholder="Payment ID из ЮKassa"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleSimulateRefund}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? '⏳ Отправляем...' : '🔄 Симулировать возврат'}
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 Инструкция:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Метод 1: Введи email пользователя и нажми "Отменить подписку"</li>
            <li>Метод 2: Введи payment_id из ЮKassa и нажми "Симулировать возврат"</li>
            <li>Проверь логи в Railway для детальной информации</li>
            <li>Обнови страницу профиля пользователя</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
