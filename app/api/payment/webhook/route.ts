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

      console.log('[Webhook] Refund received for payment:', paymentId)

      // Находим платеж и пользователя в нашей базе
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('user_id')
        .eq('payment_id', paymentId)
        .single()

      if (paymentData) {
        console.log('[Webhook] Found payment in DB, user_id:', paymentData.user_id)
        
        // Обновляем статус платежа
        await supabase
          .from('payments')
          .update({ status: 'refunded', updated_at: new Date().toISOString() })
          .eq('payment_id', paymentId)

        // Обнуляем подписку и восстанавливаем бесплатный лимит
        const { error } = await supabase
          .from('users')
          .update({ 
            pro_until: null,
            generations_left: 3,
            last_reset: new Date().toISOString()
          })
          .eq('id', paymentData.user_id)

        if (error) {
          console.error('[Webhook] Failed to cancel PRO:', error)
        } else {
          console.log(`[Webhook] 💸 Возврат: PRO отменен для ${paymentData.user_id}, восстановлено 3 генерации`)
        }
      } else {
        console.log('[Webhook] Payment not found in DB, trying to get from YooKassa API')
        
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

          const paymentInfo = await response.json()
          const userId = paymentInfo.metadata?.user_id

          if (userId) {
            console.log('[Webhook] Got user_id from YooKassa:', userId)
            
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
              console.log(`[Webhook] 💸 Возврат: PRO отменен для ${userId}, восстановлено 3 генерации`)
            }
          } else {
            console.error('[Webhook] No user_id in payment metadata from YooKassa')
          }
        } catch (apiError) {
          console.error('[Webhook] Failed to get payment from YooKassa:', apiError)
        }
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
