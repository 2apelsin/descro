'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase-client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  botUsername: string
}

export function AuthModal({ isOpen, onClose, botUsername }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'magic-link' | 'password'>('magic-link')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const supabase = getSupabaseClient()
    if (!supabase) return
    // Глобальная функция для обработки Telegram авторизации
    ;(window as any).handleTelegramAuth = async (user: any) => {
      try {
        const response = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })

        const data = await response.json()

        if (data.access_token && data.refresh_token) {
          await supabase.auth.setSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          })

          onClose()
          window.location.reload()
        } else {
          setMessage('Ошибка входа через Telegram')
        }
      } catch (error) {
        console.error('Telegram auth error:', error)
        setMessage('Ошибка входа через Telegram')
      }
    }

    // Загружаем Telegram Widget скрипт
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', botUsername)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'handleTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')

    const container = document.getElementById('telegram-login-container')
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }, [isOpen, botUsername, onClose])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = getSupabaseClient()
    if (!supabase) {
      setMessage('Ошибка инициализации')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      if (mode === 'magic-link') {
        // Вход по ссылке из email
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (error) {
          console.error('Magic link error:', error)
          setMessage('Ошибка отправки ссылки')
          return
        }

        setMessage('Ссылка отправлена на email. Проверьте папку Спам')
        setEmail('')
      } else {
        // Вход с паролем
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          // Если пользователя нет - создаём
          if (
            error.message.includes('Invalid login credentials') ||
            error.message.includes('Invalid')
          ) {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            })

            if (signUpError) {
              console.error('Sign up error:', signUpError)
              setMessage('Ошибка создания аккаунта')
              return
            }

            setMessage('Аккаунт создан! Проверьте email для подтверждения')
          } else {
            console.error('Sign in error:', error)
            setMessage('Ошибка входа')
            return
          }
        } else {
          onClose()
          window.location.reload()
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setMessage('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#1a1a1a] rounded-2xl max-w-[420px] w-full p-8 border border-[#333] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Войти в ваш аккаунт
        </h2>

        {/* Telegram Login */}
        <div className="flex justify-center mb-6">
          <div id="telegram-login-container" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-sm text-gray-500">или</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Email Login */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          {/* Переключатель режима */}
          <div className="flex gap-2 p-1 bg-[#0a0a0f] rounded-lg">
            <button
              type="button"
              onClick={() => setMode('magic-link')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'magic-link'
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'password'
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              С паролем
            </button>
          </div>

          {/* Email поле */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            required
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
          />

          {/* Поле пароля (только для режима password) */}
          {mode === 'password' && (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-12 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
                />
                {/* Кнопка глазик */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Счётчик символов */}
              <div className="flex items-center justify-between text-xs">
                <span className={`${
                  password.length >= 6 ? 'text-green-400' : 'text-gray-500'
                }`}>
                  {password.length >= 6 ? '✓ Минимум 6 символов' : 'Минимум 6 символов'}
                </span>
                <span className={`${
                  password.length >= 6 ? 'text-green-400' : password.length > 0 ? 'text-yellow-400' : 'text-gray-500'
                }`}>
                  {password.length}/6
                </span>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || (mode === 'password' && password.length < 6)}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : mode === 'magic-link' ? 'Получить ссылку' : 'Войти / Создать аккаунт'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-sm text-center text-gray-300">
            {message}
          </p>
        )}

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500 text-center">
          Нет аккаунта? Создастся автоматически
        </p>
      </div>
    </div>
  )
}
