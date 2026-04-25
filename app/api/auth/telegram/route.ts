import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

function verifyTelegramAuth(data: any): boolean {
  const { hash, ...authData } = data
  const botToken = process.env.TELEGRAM_BOT_TOKEN!
  
  // Создаём строку для проверки
  const checkString = Object.keys(authData)
    .sort()
    .map(key => `${key}=${authData[key]}`)
    .join('\n')
  
  // Вычисляем hash
  const secretKey = crypto.createHash('sha256').update(botToken).digest()
  const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex')
  
  return hmac === hash
}

export async function POST(request: NextRequest) {
  try {
    const telegramData = await request.json()
    
    // Проверяем подпись Telegram
    if (!verifyTelegramAuth(telegramData)) {
      return NextResponse.json(
        { error: 'Invalid Telegram authentication' },
        { status: 401 }
      )
    }

    const { id, first_name, username } = telegramData
    
    // Создаём email и пароль на основе Telegram ID
    const email = `tg_${id}@descro.app`
    const password = crypto
      .createHash('sha256')
      .update(`${id}${process.env.JWT_SECRET}`)
      .digest('hex')

    // Пытаемся войти
    let authResult = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Если пользователя нет - создаём
    if (authResult.error) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          telegram_id: id.toString(),
          first_name,
          username
        }
      })

      if (createError) {
        console.error('Create user error:', createError)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      // Обновляем профиль с Telegram данными
      await supabase
        .from('profiles')
        .update({
          telegram_id: id.toString(),
          first_name,
          username
        })
        .eq('id', newUser.user!.id)

      // Теперь входим
      authResult = await supabase.auth.signInWithPassword({
        email,
        password
      })
    }

    if (authResult.error || !authResult.data.session) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      access_token: authResult.data.session.access_token,
      refresh_token: authResult.data.session.refresh_token,
      user: authResult.data.user
    })

  } catch (error) {
    console.error('Telegram auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
