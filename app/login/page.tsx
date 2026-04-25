'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('✅ Проверьте почту для подтверждения регистрации!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        window.location.href = '/'
      }
    } catch (error: any) {
      setMessage('❌ ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleTelegramLogin = () => {
    window.open('https://t.me/Telegagocod_bot', '_blank')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900">Descro</span>
        </Link>

        {/* Карточка */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {/* Вкладки */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Войти
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'border-b-2 border-slate-900 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Форма */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Пароль
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                {mode === 'register' && (
                  <p className="mt-1 text-xs text-slate-500">Минимум 6 символов</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
            </form>

            {/* Сообщение */}
            {message && (
              <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                message.startsWith('✅')
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Разделитель */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-500">или</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Telegram */}
            <button
              onClick={handleTelegramLogin}
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <svg className="h-5 w-5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.504.697-.826.715-.702.031-1.235-.464-1.913-.908-.106-.07-2.022-1.294-2.164-1.415-.142-.121-.302-.363-.015-.647.287-.284 2.181-2.121 2.181-2.121s.256-.256.128-.384c-.128-.128-.384 0-.384 0s-2.612 1.656-2.899 1.848c-.287.192-.574.287-.861.287-.287 0-.574-.095-.861-.287-.287-.192-1.913-1.223-1.913-1.223s-.702-.447.495-.926c0 0 4.025-1.656 5.362-2.217.287-.12.574-.24.861-.24s.574.12.861.24c1.337.561 5.362 2.217 5.362 2.217s.702.287.495.926z"/>
              </svg>
              Продолжить через Telegram
            </button>
          </div>
        </div>

        {/* Ссылка на главную */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
