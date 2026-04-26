import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[Webhook] Full body:', JSON.stringify(body, null, 2))
    console.log('[Webhook] Event type:', body.event)

    // Успешный платёж - активируем подписку
    if (body.event === 'payment.succeeded' && body.object) {
      const payment = body.object
      const userId = payment.metadata?.user_id

      if (!userId) {
        console.error('[Webhook] No user_id in payment metadata')
        return NextResponse.json({ received: true })
      }

      // Обновляем статус платежа
      await supabase
        .from('payments')
        .update({ status: 'succeeded', updated_at: new Date().toISOString() })
        .eq('payment_id', payment.id)

      // Активируем PRO подписку на 30 дней
      const proUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      const { error } = await supabase
        .from('users')
        .update({
          pro_until: proUntil.toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('[Webhook] Failed to activate PRO:', error)
      } else {
        console.log(
          `[Webhook] ✅ PRO активирован для ${userId} до ${proUntil.toLocaleDateString('ru-RU')}`
        )
      }
    }

    // Возврат средств - отменяем подписку
    if (body.event === 'refund.succeeded' && body.object) {
      const refund = body.object
      const paymentId = refund.payment_id

      console.log('[Webhook] 💸 REFUND EVENT RECEIVED')
      console.log('[Webhook] Payment ID:', paymentId)
      console.log('[Webhook] Refund amount:', refund.amount)

      let userId = null

      // Сначала пытаемся найти платеж в нашей базе
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('user_id')
        .eq('payment_id', paymentId)
        .single()

      if (paymentData && paymentData.user_id) {
        userId = paymentData.user_id
        console.log('[Webhook] ✅ Found user in DB:', userId)
        
        // Обновляем статус платежа
        await supabase
          .from('payments')
          .update({ status: 'refunded', updated_at: new Date().toISOString() })
          .eq('payment_id', paymentId)
      } else {
        console.log('[Webhook] ⚠️ Payment not in DB, fetching from YooKassa...')
        
        // Если платеж не найден в нашей базе, получаем информацию из ЮKassa
        try {
          const shopId = process.env.YOOKASSA_SHOP_ID!
          const secretKey = process.env.YOOKASSA_SECRET_KEY!
          const auth = Buffer.from(`${shopId}:${secretKey}`).toString('base64')

          const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const paymentInfo = await response.json()
            userId = paymentInfo.metadata?.user_id
            console.log('[Webhook] YooKassa response:', JSON.stringify(paymentInfo.metadata))
            
            if (userId) {
              console.log('[Webhook] ✅ Got user from YooKassa:', userId)
            }
          } else {
            console.error('[Webhook] YooKassa API error:', response.status, await response.text())
          }
        } catch (apiError) {
          console.error('[Webhook] Failed to fetch from YooKassa:', apiError)
        }
      }

      // Если нашли user_id - отменяем подписку
      if (userId) {
        console.log('[Webhook] Canceling subscription for user:', userId)
        
        const { data: updateResult, error: updateError } = await supabase
          .from('users')
          .update({ 
            pro_until: null,
            generations_left: 3,
            last_reset: new Date().toISOString()
          })
          .eq('id', userId)
          .select()

        if (updateError) {
          console.error('[Webhook] ❌ Failed to cancel subscription:', updateError)
        } else {
          console.log('[Webhook] ✅ Subscription canceled successfully')
          console.log('[Webhook] Update result:', updateResult)
        }
      } else {
        console.error('[Webhook] ❌ Could not find user_id for refund')
      }
    }

    // Отмена платежа - отменяем подписку
    if (body.event === 'payment.canceled' && body.object) {
      const payment = body.object
      const userId = payment.metadata?.user_id

      if (!userId) {
        console.error('[Webhook] No user_id in canceled payment')
        return NextResponse.json({ received: true })
      }

      // Обновляем статус платежа
      await supabase
        .from('payments')
        .update({ status: 'canceled', updated_at: new Date().toISOString() })
        .eq('payment_id', payment.id)

      // Обнуляем подписку и восстанавливаем бесплатный лимит
      const { error } = await supabase
        .from('users')
        .update({ 
          pro_until: null,
          generations_left: 3,
          last_reset: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('[Webhook] Failed to cancel PRO:', error)
      } else {
        console.log(`[Webhook] ❌ Отмена: PRO отменен для ${userId}, восстановлено 3 генерации`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
