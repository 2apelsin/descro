'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showReset, setShowReset] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin 
        ? { email, password }
        : { email, password, name }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для получения cookies
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok) {
        // Токен теперь в httpOnly cookie, не нужно сохранять в localStorage
        onClose()
        window.location.reload()
      } else {
        setMessageType('error')
        setMessage(data.error || 'Ошибка')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Ошибка сервера')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setMessageType('error')
      setMessage('Введите email')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setMessageType('success')
        setMessage(data.message || 'Письмо отправлено на ' + email)
        setTimeout(() => {
          setShowReset(false)
          setIsLogin(true)
        }, 3000)
      } else {
        setMessageType('error')
        setMessage(data.error || 'Ошибка')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Ошибка сервера')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#1a1a1a] rounded-2xl max-w-[420px] w-full p-8 border border-[#333] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {showReset ? 'Восстановление пароля' : (isLogin ? 'Вход' : 'Регистрация')}
        </h2>

        {showReset ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
              <p className="text-sm text-blue-200">
                Введите email, на который зарегистрирован аккаунт. Мы отправим инструкции по восстановлению пароля.
              </p>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowReset(false)
                setMessage('')
              }}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Вернуться к входу
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
              />
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <p className="text-sm text-yellow-200 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>
                    <strong>Важно:</strong> Сохраните свой пароль! Если забудете - напишите на descrosupport@gmail.com
                  </span>
                </p>
              </div>
            </>
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль (минимум 6 символов)"
            required
            minLength={6}
            className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={() => {
                setShowReset(true)
                setMessage('')
              }}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              Забыли пароль?
            </button>
          )}
        </form>
        )}

        {message && (
          <p className={`mt-4 text-sm text-center ${
            messageType === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message}
          </p>
        )}

        {!showReset && (
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
            }}
            className="mt-6 w-full text-sm text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        )}
      </div>
    </div>
  )
}
