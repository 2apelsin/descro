import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Декодируем JWT токен
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Неверный токен' }, { status: 401 })
    }

    // Активируем PRO подписку на 30 дней
    const proUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const { error } = await supabase
      .from('users')
      .update({
        pro_until: proUntil.toISOString(),
      })
      .eq('id', payload.userId)

    if (error) {
      console.error('[Activate] Error:', error)
      return NextResponse.json({ error: 'Ошибка активации' }, { status: 500 })
    }

    console.log(`[Activate] ✅ PRO активирован для ${payload.userId} до ${proUntil.toLocaleDateString('ru-RU')}`)

    return NextResponse.json({ 
      success: true,
      pro_until: proUntil.toISOString()
    })

  } catch (error: any) {
    console.error('[Activate] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
