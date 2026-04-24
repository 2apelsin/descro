'use client'

import { useEffect, useRef } from 'react'

export function TelegramLogin() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Функция которую вызовет Telegram Widget
    (window as any).onTelegramAuth = async (user: any) => {
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        })
        
        const data = await res.json()
        
        if (data.success && data.token) {
          localStorage.setItem('descro_token', data.token)
          window.location.reload()
        }
      } catch (error) {
        console.error('Auth error:', error)
      }
    }

    // Создаем script элемент для Telegram Widget
    if (containerRef.current && !containerRef.current.querySelector('script')) {
      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.async = true
      script.setAttribute('data-telegram-login', 'Telegagocod_bot')
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      containerRef.current.appendChild(script)
    }
  }, [])

  return <div ref={containerRef} />
}
