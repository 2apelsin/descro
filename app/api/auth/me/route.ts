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

    // Получаем профиль из Supabase
    const { data: profile, error } = await supabase
      .from('teleg')
      .select('*')
      .eq('telegram_id', payload.telegram_id)
      .single()

    if (error || !profile) {
      return NextResponse.json({ success: false, error: 'Пользователь не найден' }, { status: 404 })
    }

    // Проверяем нужно ли сбросить счётчик (прошло 24 часа)
    const lastReset = new Date(profile.last_reset).getTime()
    const now = Date.now()

    if (now - lastReset > 24 * 60 * 60 * 1000) {
      // Сбрасываем счётчик
      await supabase
        .from('teleg')
        .update({
          generations_left: 3,
          last_reset: new Date().toISOString(),
        })
        .eq('telegram_id', payload.telegram_id)

      profile.generations_left = 3
      profile.last_reset = new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      user: {
        telegram_id: profile.telegram_id,
        username: profile.username,
        first_name: profile.first_name,
        generations_left: profile.generations_left,
        pro_until: profile.pro_until,
        last_reset: profile.last_reset,
      }
    })
  } catch (error) {
    console.error('[Auth/Me] Error:', error)
    return NextResponse.json({ success: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
