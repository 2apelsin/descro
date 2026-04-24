import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { randomUUID } from 'crypto'

const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY

export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Неверный токен' },
        { status: 401 }
      )
    }

    const { plan } = await req.json()
    
    // Определяем цену в зависимости от плана
    const prices: Record<string, { amount: string; description: string }> = {
      'pro-first': {
        amount: '199.00',
        description: 'Descro PRO — первый месяц (скидка 33%)'
      },
      'pro': {
        amount: '299.00',
        description: 'Descro PRO — 1 месяц'
      }
    }

    const priceData = prices[plan] || prices['pro']

    // Создаём платёж в ЮKassa
    const idempotenceKey = randomUUID()
    
    const paymentData = {
      amount: {
        value: priceData.amount,
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://descro-production.up.railway.app'}/payment/success`
      },
      capture: true,
      description: priceData.description,
      metadata: {
        telegram_id: payload.telegram_id.toString(),
        plan: plan
      }
    }

    const auth = Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`).toString('base64')

    const response = await fetch('https://api.yookassa.ru/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(paymentData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('YooKassa error:', error)
      throw new Error('Ошибка создания платежа')
    }

    const payment = await response.json()

    return NextResponse.json({
      success: true,
      paymentUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id
    })

  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка создания платежа' },
      { status: 500 }
    )
  }
}
