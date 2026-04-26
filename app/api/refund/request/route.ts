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

    // Получаем пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, pro_until, created_at')
      .eq('id', payload.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
    }

    // Проверяем, есть ли активная подписка
    const isPro = user.pro_until && new Date(user.pro_until) > new Date()
    if (!isPro) {
      return NextResponse.json({ 
        error: 'У вас нет активной подписки' 
      }, { status: 400 })
    }

    // Проверяем, когда была активирована подписка (должно быть не более 7 дней назад)
    const { data: lastPayment } = await supabase
      .from('payments')
      .select('created_at, payment_id')
      .eq('user_id', user.id)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lastPayment) {
      return NextResponse.json({ 
        error: 'Платеж не найден' 
      }, { status: 404 })
    }

    const paymentDate = new Date(lastPayment.created_at)
    const daysSincePurchase = Math.floor((Date.now() - paymentDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSincePurchase > 7) {
      return NextResponse.json({ 
        error: 'Возврат возможен только в течение 7 дней после покупки' 
      }, { status: 400 })
    }

    // Создаем запрос на возврат (сохраняем в базу для ручной обработки)
    const { error: insertError } = await supabase
      .from('refund_requests')
      .insert({
        user_id: user.id,
        payment_id: lastPayment.payment_id,
        reason: 'User requested refund',
        status: 'pending'
      })

    if (insertError) {
      console.error('[Refund] Failed to create request:', insertError)
      return NextResponse.json({ 
        error: 'Не удалось создать запрос на возврат' 
      }, { status: 500 })
    }

    console.log(`[Refund] Request created for user ${user.id}, payment ${lastPayment.payment_id}`)

    return NextResponse.json({ 
      success: true,
      message: 'Запрос на возврат отправлен. Мы обработаем его в течение 1-3 рабочих дней.',
      days_since_purchase: daysSincePurchase
    })

  } catch (error: any) {
    console.error('[Refund] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
