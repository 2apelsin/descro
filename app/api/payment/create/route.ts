import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { checkRateLimit } from '@/lib/rate-limit'

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

    // Rate limiting - не более 3 попыток создания платежа в минуту
    const rateLimitCheck = checkRateLimit(`payment:${payload.userId}`, 3, 60000)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        error: 'Слишком много попыток. Пожалуйста, подождите минуту.' 
      }, { status: 429 })
    }

    // Получаем пользователя из базы
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, pro_until')
      .eq('id', payload.userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 })
    }

    // Проверяем, нет ли уже активной подписки
    const isPro = user.pro_until && new Date(user.pro_until) > new Date()
    if (isPro) {
      return NextResponse.json({ 
        error: 'У вас уже есть активная PRO подписка' 
      }, { status: 400 })
    }

    // Проверяем, нет ли незавершенных платежей за последние 10 минут
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { data: recentPayments } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('created_at', tenMinutesAgo)

    if (recentPayments && recentPayments.length > 0) {
      return NextResponse.json({ 
        error: 'У вас уже есть незавершенный платеж. Пожалуйста, завершите его или подождите 10 минут.' 
      }, { status: 400 })
    }

    // Создаём платёж в ЮKassa
    const shopId = process.env.YOOKASSA_SHOP_ID!
    const secretKey = process.env.YOOKASSA_SECRET_KEY!
    
    console.log('[Payment] Credentials check:', {
      hasShopId: !!shopId,
      hasSecretKey: !!secretKey,
      shopId: shopId?.substring(0, 4) + '***',
      secretKeyLength: secretKey?.length
    })
    
    if (!shopId || !secretKey) {
      console.error('[Payment] Missing YooKassa credentials')
      return NextResponse.json({ error: 'Платежи временно недоступны' }, { status: 500 })
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')

    const paymentData = {
      amount: {
        value: '199.00', // Первый месяц со скидкой
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          'https://descro-production.up.railway.app'
        }/payment/success`,
      },
      description: 'PRO подписка на 1 месяц',
      metadata: {
        user_id: user.id,
      },
    }

    console.log('[Payment] Creating payment for user:', user.id)

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': `${user.id}-${Date.now()}`,
      },
      body: JSON.stringify(paymentData)
    })

    const payment = await response.json()

    if (!response.ok) {
      console.error('[Payment] YooKassa error:', {
        status: response.status,
        statusText: response.statusText,
        payment
      })
      return NextResponse.json(
        { error: 'Ошибка создания платежа: ' + (payment.description || payment.type || 'Неизвестная ошибка') },
        { status: 500 }
      )
    }

    console.log('[Payment] Success, redirecting to:', payment.confirmation.confirmation_url)

    // Сохраняем информацию о платеже в базу
    const { error: saveError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        payment_id: payment.id,
        amount: 199.00,
        status: 'pending'
      })

    if (saveError) {
      console.error('[Payment] Failed to save payment:', saveError)
    }

    return NextResponse.json({
      confirmation_url: payment.confirmation.confirmation_url,
      payment_id: payment.id
    })

  } catch (error: any) {
    console.error('[Payment] Error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера: ' + error.message },
      { status: 500 }
    )
  }
}
