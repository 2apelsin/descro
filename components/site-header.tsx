'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AuthModal } from './auth-modal'

export function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('descro_token')

    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          localStorage.removeItem('descro_token')
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }

    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('descro_token')
    window.location.reload()
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">Descro</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Возможности
            </Link>
            <Link
              href="#how"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Как работает
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Тарифы
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  <span>{user.name || user.email}</span>
                  {user.pro_until && new Date(user.pro_until) > new Date() && (
                    <span className="rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                      PRO
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  )
}
