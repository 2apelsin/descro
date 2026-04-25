'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AuthModal } from './auth-modal'

interface GenerationLimiterProps {
  children: React.ReactNode
  onGenerationAttempt: () => Promise<boolean>
  botUsername: string
}

export function GenerationLimiter({ children, onGenerationAttempt, botUsername }: GenerationLimiterProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [guestGenerations, setGuestGenerations] = useState(3)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Инициализируем Supabase только на клиенте
    if (typeof window !== 'undefined') {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Авторизованный пользователь - получаем профиль
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(profile)
        
        // Проверяем лимиты
        const isPro = profile?.pro_until && new Date(profile.pro_until) > new Date()
        if (!isPro && profile?.generations_left <= 0) {
          setIsBlocked(true)
        }
      } else {
        // Гость - проверяем localStorage
        const stored = localStorage.getItem('descro_guest_generations')
        const count = stored ? parseInt(stored) : 3
        setGuestGenerations(count)
        
        if (count <= 0) {
          setIsBlocked(true)
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGeneration = async () => {
    if (!supabase) return
    
    const success = await onGenerationAttempt()
    
    if (success) {
      if (user) {
        // Уменьшаем счётчик в базе
        const isPro = profile?.pro_until && new Date(profile.pro_until) > new Date()
        if (!isPro) {
          const newCount = (profile?.generations_left || 0) - 1
          await supabase
            .from('profiles')
            .update({ generations_left: newCount })
            .eq('id', user.id)
          
          setProfile({ ...profile, generations_left: newCount })
          
          if (newCount <= 0) {
            setIsBlocked(true)
          }
        }
      } else {
        // Уменьшаем счётчик гостя
        const newCount = guestGenerations - 1
        setGuestGenerations(newCount)
        localStorage.setItem('descro_guest_generations', newCount.toString())
        
        if (newCount <= 0) {
          setIsBlocked(true)
        }
      }
    }
  }

  const isPro = profile?.pro_until && new Date(profile.pro_until) > new Date()
  const generationsLeft = user 
    ? (isPro ? '∞' : profile?.generations_left || 0)
    : guestGenerations

  if (loading) {
    return <div className="opacity-50">{children}</div>
  }

  return (
    <div className="relative">
      {/* Основной контент */}
      <div className={isBlocked ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>

      {/* Блокировка для гостей */}
      {isBlocked && !user && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
          <div className="text-center p-6 max-w-md">
            <p className="text-xl font-bold text-white mb-4">
              Бесплатные попытки закончились
            </p>
            <p className="text-gray-300 mb-6">
              Войдите, чтобы продолжить
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Войти в аккаунт
            </button>
          </div>
        </div>
      )}

      {/* Блокировка для авторизованных без PRO */}
      {isBlocked && user && !isPro && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
          <div className="text-center p-6 max-w-md">
            <p className="text-xl font-bold text-white mb-4">
              Бесплатные попытки закончились
            </p>
            <p className="text-gray-300 mb-6">
              Оформите PRO для безлимитной генерации
            </p>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/50"
            >
              Оформить PRO — 299 ₽/мес
            </button>
          </div>
        </div>
      )}

      {/* Счётчик попыток */}
      {!isBlocked && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            {isPro ? (
              <span className="text-purple-400 font-semibold">
                ✨ PRO активен до {new Date(profile.pro_until).toLocaleDateString('ru-RU')}
              </span>
            ) : (
              <>
                Осталось попыток: <span className="font-semibold text-white">{generationsLeft}</span>
              </>
            )}
          </p>
        </div>
      )}

      {/* Модалка авторизации */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        botUsername={botUsername}
      />
    </div>
  )
}
