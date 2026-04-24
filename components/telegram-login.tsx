'use client'

import { useState } from 'react'

export function TelegramLogin() {
  const [loading, setLoading] = useState(false)

  const handleTelegramLogin = () => {
    setLoading(true)
    
    // Открываем Telegram бота с параметром start
    const botUsername = 'Telegagocod_bot'
    const siteUrl = window.location.origin
    
    // Создаем deep link с параметром для возврата на сайт
    const startParam = btoa(siteUrl).replace(/=/g, '')
    const telegramUrl = `https://t.me/${botUsername}?start=${startParam}`
    
    // Открываем в новом окне
    const popup = window.open(telegramUrl, '_blank', 'width=600,height=700')
    
    // Проверяем закрытие окна
    const checkPopup = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkPopup)
        setLoading(false)
      }
    }, 1000)
    
    // Таймаут на случай если окно не закроется
    setTimeout(() => {
      setLoading(false)
      clearInterval(checkPopup)
    }, 60000)
  }

  return (
    <button
      onClick={handleTelegramLogin}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg bg-[#0088cc] px-4 py-2 text-sm font-medium text-white hover:bg-[#0077b3] disabled:opacity-50 transition-colors"
      title="Войти через Telegram"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 3.767-1.362 5.001-.169.523-.504.697-.826.715-.702.031-1.235-.464-1.913-.908-.106-.07-2.022-1.294-2.164-1.415-.142-.121-.302-.363-.015-.647.287-.284 2.181-2.121 2.181-2.121s.256-.256.128-.384c-.128-.128-.384 0-.384 0s-2.612 1.656-2.899 1.848c-.287.192-.574.287-.861.287-.287 0-.574-.095-.861-.287-.287-.192-1.913-1.223-1.913-1.223s-.702-.447.495-.926c0 0 4.025-1.656 5.362-2.217.287-.12.574-.24.861-.24s.574.12.861.24c1.337.561 5.362 2.217 5.362 2.217s.702.287.495.926z"/>
      </svg>
      {loading ? (
        <span className="hidden sm:inline">Открываем Telegram...</span>
      ) : (
        <>
          <span className="hidden sm:inline">Войти через Telegram</span>
          <span className="sm:hidden">Telegram</span>
        </>
      )}
    </button>
  )
}
