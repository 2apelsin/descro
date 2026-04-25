'use client'

import { useState, useEffect } from 'react'

interface GenerationLimiterProps {
  children: React.ReactNode
  onGenerationAttempt: () => Promise<boolean>
}

export function GenerationLimiter({ children, onGenerationAttempt }: GenerationLimiterProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('descro_token')
    
    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }
    
    setLoading(false)
  }

  const handleGeneration = async () => {
    const success = await onGenerationAttempt()
    
    if (success && user) {
      // Обновляем данные пользователя после генерации
      await checkAuth()
    }
  }

  if (loading) {
    return <div className="opacity-50">{children}</div>
  }

  const isPro = user?.pro_until && new Date(user.pro_until) > new Date()
  const generationsLeft = user?.generations_left || 0
  const isBlocked = !isPro && generationsLeft <= 0

  return (
    <div className="relative">
      {/* Основной контент */}
      <div className={isBlocked ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>

      {/* Блокировка */}
      {isBlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
          <div className="text-center p-6 max-w-md">
            <p className="text-xl font-bold text-white mb-4">
              Бесплатные попытки закончились
            </p>
            <p className="text-gray-300 mb-6">
              {user ? 'Оформите PRO для безлимитной генерации' : 'Войдите, чтобы продолжить'}
            </p>
            <button
              onClick={() => window.location.href = user ? '/#pricing' : '/'}
              className="px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              {user ? 'Купить PRO — 199 ₽/мес' : 'Войти'}
            </button>
          </div>
        </div>
      )}

      {/* Счётчик попыток */}
      {!isBlocked && user && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            {isPro ? (
              <span className="text-purple-400 font-semibold">
                ✨ PRO активен до {new Date(user.pro_until).toLocaleDateString('ru-RU')}
              </span>
            ) : (
              <>
                Осталось попыток сегодня: <span className="font-semibold text-white">{generationsLeft}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
