'use client'

import Link from 'next/link'

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-3xl font-bold mb-2">Оплата отменена</h1>
        <p className="text-gray-400 mb-6">
          Вы можете попробовать снова в любой момент.
        </p>
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-opacity"
          >
            Попробовать снова
          </Link>
          <Link
            href="/"
            className="block bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
