'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на главную страницу
    // Там есть модалка авторизации
    router.push('/')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
        <p className="text-white">Перенаправление...</p>
      </div>
    </div>
  )
}
