'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (res.ok && data.token) {
        localStorage.setItem('descro_token', data.token)
        onClose()
        window.location.reload()
      } else {
        setMessage(data.error || 'Ошибка')
      }
    } catch (error) {
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
          {isLogin ? 'Вход' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-3 bg-[#0a0a0f] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-colors"
            />
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
            placeholder="Пароль"
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
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-red-400">
            {message}
          </p>
        )}

        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
          }}
          className="mt-6 w-full text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}
