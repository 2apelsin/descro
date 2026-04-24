'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function TelegramLogin() {
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
  }, [])

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-widget.js?22"
        strategy="lazyOnload"
      />
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="Telegagocod_bot"
        data-size="medium"
        data-onauth="onTelegramAuth(user)"
        data-request-access="write"
      />
    </>
  )
}
