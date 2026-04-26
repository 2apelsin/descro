import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function GET(req: NextRequest) {
  try {
    // Читаем токен из cookie (приоритет) или из Authorization header (для обратной совместимости)
    let token = req.cookies.get('auth_token')?.value
    
    if (!token) {
      const authHeader = req.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 })
    }
    
    // Проверяем токен
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ success: false, error: 'Неверный токен' }, { status: 401 })
    }

    // Получаем пользователя
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', payload.userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ success: false, error: 'Пользователь не найден' }, { status: 404 })
    }

    // Проверяем нужно ли сбросить счётчик (прошло 24 часа)
    const lastReset = new Date(user.last_reset).getTime()
    const now = Date.now()

    if (now - lastReset > 24 * 60 * 60 * 1000) {
      await supabase
        .from('users')
        .update({
          generations_left: 3,
          last_reset: new Date().toISOString()
        })
        .eq('id', user.id)

      user.generations_left = 3
      user.last_reset = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        generations_left: user.generations_left,
        pro_until: user.pro_until,
        last_reset: user.last_reset,
        created_at: user.created_at
      }
    })
  } catch (error) {
    console.error('[Auth/Me] Error:', error)
    return NextResponse.json({ success: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
