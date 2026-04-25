import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createToken, verifyTelegramAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, first_name, username, hash, auth_date } = body

    if (!id || !hash) {
      return NextResponse.json({ success: false, error: 'Неверные данные' }, { status: 400 })
    }

    // Проверяем подпись Telegram
    const botToken = process.env.TELEGRAM_BOT_TOKEN!
    const isValid = verifyTelegramAuth(body, botToken)

    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Неверная подпись' }, { status: 403 })
    }

    // Проверяем что auth_date не старше 24 часов
    const authTime = parseInt(auth_date) * 1000
    if (Date.now() - authTime > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ success: false, error: 'Авторизация устарела' }, { status: 403 })
    }

    const telegram_id = parseInt(id)

    // Ищем пользователя
    const { data: existingUser } = await supabaseAdmin
      .from('teleg')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single()

    if (existingUser) {
      // Обновляем данные
      await supabaseAdmin
        .from('teleg')
        .update({
          username: username || null,
          first_name: first_name || null,
        })
        .eq('telegram_id', telegram_id)
    } else {
      // Создаём нового пользователя
      await supabaseAdmin
        .from('teleg')
        .insert({
          telegram_id,
          username: username || null,
          first_name: first_name || null,
          generations_left: 3,
          last_reset: new Date().toISOString(),
          pro_until: null,
        })
    }

    // Создаём JWT токен
    const token = await createToken({ telegram_id, username: username || null })

    return NextResponse.json({
      success: true,
      token,
      user: {
        telegram_id,
        username: username || null,
        first_name: first_name || null,
      }
    })
  } catch (error) {
    console.error('[Auth] Error:', error)
    return NextResponse.json({ success: false, error: 'Ошибка авторизации' }, { status: 500 })
  }
}
