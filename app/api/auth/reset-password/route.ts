import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email обязателен' }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (!user) {
      // Не раскрываем, существует ли email (безопасность)
      return NextResponse.json({ 
        success: true,
        message: 'Если этот email зарегистрирован, на него отправлено письмо с инструкциями'
      })
    }

    // TODO: Здесь должна быть отправка email через Resend/SendGrid
    // Пока просто логируем
    console.log('[Password Reset] Request for:', email)
    
    // В будущем:
    // 1. Создать токен сброса пароля
    // 2. Сохранить в БД с временем истечения
    // 3. Отправить email с ссылкой
    
    return NextResponse.json({ 
      success: true,
      message: 'Если этот email зарегистрирован, на него отправлено письмо с инструкциями'
    })

  } catch (error: any) {
    console.error('[Password Reset] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
