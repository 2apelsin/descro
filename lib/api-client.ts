// Вспомогательные функции для API запросов с автоматической отправкой cookies

export async function apiGet(url: string) {
  return fetch(url, {
    method: 'GET',
    credentials: 'include', // Автоматически отправляет httpOnly cookies
  })
}

export async function apiPost(url: string, body?: any) {
  return fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include', // Автоматически отправляет httpOnly cookies
    body: body ? JSON.stringify(body) : undefined,
  })
}

export async function apiDelete(url: string) {
  return fetch(url, {
    method: 'DELETE',
    credentials: 'include', // Автоматически отправляет httpOnly cookies
  })
}

// Для обратной совместимости - проверяет есть ли старый токен в localStorage
// и мигрирует его в cookie через API
export async function migrateOldToken() {
  const oldToken = localStorage.getItem('descro_token')
  
  if (oldToken) {
    try {
      // Проверяем токен через API (который установит cookie)
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${oldToken}` },
        credentials: 'include'
      })
      
      if (res.ok) {
        // Токен валидный, удаляем из localStorage
        localStorage.removeItem('descro_token')
        console.log('[Migration] Old token migrated to httpOnly cookie')
      }
    } catch (error) {
      console.error('[Migration] Failed to migrate token:', error)
    }
  }
}
