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
    // Читаем токен из cookie или header
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
    
    let payload: any
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ success: false, error: 'Неверный токен' }, { status: 401 })
    }

    // Получаем последние 20 генераций
    const { data: generations, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[Generations] Error:', error)
      return NextResponse.json({ success: false, error: 'Ошибка получения истории' }, { status: 500 })
    }

    return NextResponse.json({ success: true, generations })
  } catch (error) {
    console.error('[Generations] Error:', error)
    return NextResponse.json({ success: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
