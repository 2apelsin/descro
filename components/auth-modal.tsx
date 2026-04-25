'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  botUsername: string
}

export function AuthModal({ isOpen, onClose, botUsername }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      // Глобальная функция для обработки Telegram авторизации
      (window as any).handleTelegramAuth = async (user: any) => {
        try {
          const response = await fetch('/api/auth/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          })

          const data = await response.json()

          if (data.access_token && data.refresh_token) {
            await supabase.auth.setSession({
              access_token: data.access_token,
              refresh_token: data.refresh_token
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
    }
  }, [isOpen, botUsername, onClose, supabase.auth])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      setMessage('✅ Ссылка отправлена на email. Проверьте папку Спам')
      setEmail('')
    } catch (error: any) {
      setMessage(`❌ ${error.message}`)
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            required
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Получить ссылку для входа'}
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
