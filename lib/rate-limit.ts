// Простой rate limiter в памяти
const rateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000 // 1 минута
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimit.get(identifier)

  // Если записи нет или окно истекло - создаем новую
  if (!record || now > record.resetAt) {
    rateLimit.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  // Проверяем лимит
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // Увеличиваем счетчик
  record.count++
  return { allowed: true, remaining: maxRequests - record.count }
}

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimit.entries()) {
    if (now > record.resetAt) {
      rateLimit.delete(key)
    }
  }
}, 5 * 60 * 1000)
