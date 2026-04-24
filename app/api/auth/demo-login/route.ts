import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET метод для прямой авторизации через ссылку
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const telegramId = searchParams.get('telegram_id')
    const username = searchParams.get('username')
    const firstName = searchParams.get('first_name')

    if (!telegramId) {
      return NextResponse.redirect(new URL('/?error=missing_telegram_id', req.url))
    }

    const userData = {
      telegram_id: parseInt(telegramId),
      username: username || null,
      first_name: firstName || 'Пользователь',
    }

    // Проверяем есть ли уже такой пользователь в базе
    const { data: existingUser } = await supabase
      .from('teleg')
      .select('*')
      .eq('telegram_id', userData.telegram_id)
      .single()

    if (!existingUser) {
      // Создаем нового пользователя
      await supabase
        .from('teleg')
        .insert({
          telegram_id: userData.telegram_id,
          username: userData.username,
          first_name: userData.first_name,
          generations_left: 3,
          last_reset: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
    }

    // Создаем JWT токен
    const token = await createToken(userData)

    // Перенаправляем на callback с токеном
    return NextResponse.redirect(new URL(`/auth/callback?token=${token}`, req.url))
  } catch (error: any) {
    console.error('Direct login error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}

// POST метод для демо-входа (для тестирования)
export async function POST() {
  try {
    // Создаем тестового пользователя для демонстрации
    const demoUser = {
      telegram_id: Math.floor(Math.random() * 1000000000),
      username: 'demo_user',
      first_name: 'Демо Пользователь',
    }

    // Проверяем есть ли уже такой пользователь в базе
    const { data: existingUser } = await supabase
      .from('teleg')
      .select('*')
      .eq('telegram_id', demoUser.telegram_id)
      .single()

    if (!existingUser) {
      // Создаем нового пользователя
      await supabase
        .from('teleg')
        .insert({
          telegram_id: demoUser.telegram_id,
          username: demoUser.username,
          first_name: demoUser.first_name,
          generations_left: 3,
          last_reset: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
    }

    // Создаем JWT токен
    const token = await createToken(demoUser)

    return NextResponse.json({
      success: true,
      token,
      user: demoUser,
    })
  } catch (error: any) {
    console.error('Demo login error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
