import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Получаем пользователя из базы
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', token)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Создаём платёж в ЮKassa
    const shopId = process.env.YOOKASSA_SHOP_ID!
    const secretKey = process.env.YOOKASSA_SECRET_KEY!
    const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')

    const paymentData = {
      amount: {
        value: '199.00',
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
      console.error('YooKassa error:', payment)
      return NextResponse.json(
        { error: 'Payment creation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      confirmation_url: payment.confirmation.confirmation_url,
      payment_id: payment.id
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
