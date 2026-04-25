'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { SimpleAuth } from "./simple-auth"

export function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    // Получаем текущего пользователя
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-900">Descro</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-slate-600 hover:text-slate-900">
            Возможности
          </Link>
          <Link href="#how" className="text-sm text-slate-600 hover:text-slate-900">
            Как работает
          </Link>
          <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">
            Тарифы
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-sm sm:block">
                <div className="font-medium text-slate-900">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
