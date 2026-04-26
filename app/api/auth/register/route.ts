import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    console.log('[Register] Attempt:', { email, name })

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }

    // Проверяем существует ли пользователь
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[Register] Check user error:', checkError)
      return NextResponse.json({ error: 'Ошибка проверки пользователя' }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ error: 'Email уже используется' }, { status: 400 })
    }

    // Хешируем пароль
    console.log('[Register] Hashing password...')
    const passwordHash = await bcrypt.hash(password, 10)

    // Создаём пользователя
    console.log('[Register] Creating user...')
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name: name || email.split('@')[0],
        generations_left: 3,
        last_reset: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('[Register] Create user error:', error)
      return NextResponse.json({ error: 'Ошибка регистрации: ' + error.message }, { status: 500 })
    }

    // Создаём токен
    console.log('[Register] Creating token...')
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })

    console.log('[Register] Success:', user.id)

    // Создаём response с httpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        generations_left: user.generations_left,
        pro_until: user.pro_until
      }
    })

    // Устанавливаем httpOnly cookie (безопаснее localStorage)
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      path: '/'
    })

    return response
  } catch (error: any) {
    console.error('[Register] Error:', error)
    return NextResponse.json({ error: 'Ошибка сервера: ' + error.message }, { status: 500 })
  }
}
