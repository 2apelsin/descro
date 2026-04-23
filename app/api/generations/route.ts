import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Неверный токен' }, { status: 401 })
    }

    // Получаем последние 10 генераций
    const { data: generations, error } = await supabase
      .from('generations')
      .select('*')
      .eq('user_id', payload.telegram_id)
      .order('created_at', { ascending: false })
      .limit(10)

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
