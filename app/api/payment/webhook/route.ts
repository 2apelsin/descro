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

      // Обновляем профиль пользователя - добавляем 30 дней PRO
      const proUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      
      const { error } = await supabase
        .from('profiles')
        .update({
          pro_until: proUntil.toISOString(),
          generations_left: 999 // Даём большой лимит для PRO
        })
        .eq('id', userId)

      if (error) {
        console.error('Failed to update user profile:', error)
      } else {
        console.log(`PRO activated for user ${userId} until ${proUntil}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
