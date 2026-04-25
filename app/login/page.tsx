'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setMessage('✅ Проверьте почту! Мы отправили ссылку для входа.')
      setEmail('')
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Логотип */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">Войти в ваш аккаунт</h1>
          <p className="mt-2 text-slate-400">Выберите удобный способ входа</p>
        </div>

        {/* Форма входа */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          {/* Telegram */}
          <button
            onClick={handleTelegramLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0088cc] px-6 py-4 text-white transition-all hover:bg-[#0077b3] hover:shadow-lg"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.504.697-.826.715-.702.031-1.235-.464-1.913-.908-.106-.07-2.022-1.294-2.164-1.415-.142-.121-.302-.363-.015-.647.287-.284 2.181-2.121 2.181-2.121s.256-.256.128-.384c-.128-.128-.384 0-.384 0s-2.612 1.656-2.899 1.848c-.287.192-.574.287-.861.287-.287 0-.574-.095-.861-.287-.287-.192-1.913-1.223-1.913-1.223s-.702-.447.495-.926c0 0 4.025-1.656 5.362-2.217.287-.12.574-.24.861-.24s.574.12.861.24c1.337.561 5.362 2.217 5.362 2.217s.702.287.495.926z"/>
            </svg>
            <span className="font-medium">Войти через Telegram</span>
          </button>

          {/* Разделитель */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-500">или</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Email */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email адрес
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Отправляем...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Войти через Email</span>
                </>
              )}
            </button>
          </form>

          {/* Сообщение */}
          {message && (
            <div className={`mt-4 rounded-lg p-4 text-sm ${
              message.startsWith('✅') 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Подсказка */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Мы отправим вам ссылку для входа. Пароль не нужен!
          </p>
        </div>

        {/* Ссылка на главную */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
