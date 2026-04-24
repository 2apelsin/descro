'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const token = searchParams?.get('token')
    
    if (token) {
      try {
        // Сохраняем токен
        localStorage.setItem('descro_token', token)
        
        setStatus('success')
        
        // Перенаправляем на главную через 1 секунду
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (error) {
        console.error('Auth error:', error)
        setStatus('error')
      }
    } else {
      setStatus('error')
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="mb-4 text-6xl">🔐</div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Авторизация...</h1>
            <p className="text-slate-600">Подождите немного</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mb-4 text-6xl">✅</div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Успешно!</h1>
            <p className="text-slate-600">Перенаправляем на главную...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="mb-4 text-6xl">❌</div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900">Ошибка авторизации</h1>
            <p className="mb-4 text-slate-600">Попробуйте войти снова</p>
            <button
              onClick={() => router.push('/')}
              className="rounded-lg bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
            >
              На главную
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 text-6xl">🔐</div>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Загрузка...</h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
