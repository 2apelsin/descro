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
    
    // Слушаем событие открытия модалки
    const handleOpenAuth = () => setShowAuth(true)
    window.addEventListener('openAuthModal', handleOpenAuth)
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuth)
    }
  }, [])

  const checkAuth = async () => {
    try {
      // Токен в httpOnly cookie, браузер отправит автоматически
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    window.location.reload()
  }

  return (
    <>
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <svg
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
            <span className="text-base sm:text-lg font-semibold text-slate-900">Descro</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <Link
              href="#features"
              className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 hidden sm:inline"
            >
              Возможности
            </Link>
            <Link
              href="#how"
              className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 hidden sm:inline"
            >
              Как работает
            </Link>
            <Link
              href="#pricing"
              className="text-xs sm:text-sm text-slate-600 hover:text-slate-900"
            >
              Тарифы
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <div className="h-9 w-20 sm:h-10 sm:w-24 animate-pulse rounded-lg bg-slate-200" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-600"
                >
                  <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                  {user.pro_until && new Date(user.pro_until) > new Date() && (
                    <span className="rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                      PRO
                    </span>
                  )}
                </Link>
                <Link
                  href="/dashboard"
                  className="md:hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-200 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-lg bg-slate-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-slate-800"
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
