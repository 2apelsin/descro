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
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }

    // Находим пользователя
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password_hash)

    if (!validPassword) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
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

    // Создаём токен
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        generations_left: user.generations_left,
        pro_until: user.pro_until
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
