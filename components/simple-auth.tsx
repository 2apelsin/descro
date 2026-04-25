'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function SimpleAuth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
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

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Отправляем...' : 'Войти через Email'}
        </button>
      </form>
      {message && (
        <p className="mt-3 text-sm text-slate-600">{message}</p>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Мы отправим вам ссылку для входа. Не нужен пароль!
      </p>
    </div>
  )
}
