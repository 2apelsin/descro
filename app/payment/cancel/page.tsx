import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#16161e] rounded-2xl p-8 text-center border border-[#333]">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Оплата отменена
        </h1>
        
        <p className="text-gray-300 mb-8">
          Вы можете попробовать снова в любое время
        </p>
        
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Попробовать снова
          </Link>
          
          <Link
            href="/"
            className="block px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#222] transition-colors border border-[#333]"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
