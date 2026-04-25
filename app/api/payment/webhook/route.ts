import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('YooKassa webhook received:', body)

    // Проверяем, что это успешный платёж
    if (body.event === 'payment.succeeded' && body.object) {
      const payment = body.object
      const userId = payment.metadata?.user_id

      if (!userId) {
        console.error('No user_id in payment metadata')
        return NextResponse.json({ received: true })
      }

      // Активируем PRO подписку на 30 дней
      const proUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      const { error } = await supabase
        .from('users')
        .update({
          pro_until: proUntil.toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Failed to activate PRO:', error)
      } else {
        console.log(
          `✅ PRO активирован для пользователя ${userId} до ${proUntil.toLocaleDateString(
            'ru-RU'
          )}`
        )
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
