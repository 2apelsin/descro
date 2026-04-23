import { SignJWT, jwtVerify } from 'jose'
import { createHmac } from 'crypto'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'change-this-secret')

export async function createToken(payload: { telegram_id: number; username: string | null }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .setIssuedAt()
    .sign(JWT_SECRET)
  
  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { telegram_id: number; username: string | null }
  } catch {
    return null
  }
}

export function verifyTelegramAuth(data: Record<string, string>, botToken: string): boolean {
  const { hash, ...authData } = data
  
  // Сортируем ключи и создаём строку для проверки
  const dataCheckString = Object.keys(authData)
    .sort()
    .map(key => `${key}=${authData[key]}`)
    .join('\n')
  
  // Создаём секретный ключ
  const secretKey = createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest()
  
  // Вычисляем hash
  const calculatedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')
  
  return calculatedHash === hash
}
