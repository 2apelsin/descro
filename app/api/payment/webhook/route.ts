import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const notification = JSON.parse(body)

    // Проверяем подпись (опционально, но рекомендуется)
    // ЮKassa отправляет IP-адреса: 185.71.76.0/27, 185.71.77.0/27, 77.75.153.0/25, 77.75.156.11, 77.75.156.35, 2a02:5180::/32
    
    console.log('[Webhook] Received notification:', notification.event)

    // Обрабатываем только успешные платежи
    if (notification.event === 'payment.succeeded') {
      const payment = notification.object
      const telegramId = parseInt(payment.metadata.telegram_id)
      const plan = payment.metadata.plan

      console.log('[Webhook] Payment succeeded for user:', telegramId)

      // Определяем срок действия PRO
      const now = new Date()
      let proUntil: Date

      if (plan === 'pro-first' || plan === 'pro') {
        // 1 месяц
        proUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      } else {
        proUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      }

      // Обновляем пользователя в базе
      const { data: user, error: fetchError } = await supabase
        .from('teleg')
        .select('*')
        .eq('telegram_id', telegramId)
        .single()

      if (fetchError || !user) {
        console.error('[Webhook] User not found:', telegramId)
        // Создаём пользователя если его нет
        await supabase
          .from('teleg')
          .insert({
            telegram_id: telegramId,
            username: null,
            first_name: null,
            generations_left: 999999, // Безлимит для PRO
            last_reset: now.toISOString(),
            pro_until: proUntil.toISOString(),
            created_at: now.toISOString()
          })
      } else {
        // Обновляем существующего пользователя
        await supabase
          .from('teleg')
          .update({
            pro_until: proUntil.toISOString(),
            generations_left: 999999 // Безлимит для PRO
          })
          .eq('telegram_id', telegramId)
      }

      console.log('[Webhook] ✓ User upgraded to PRO until:', proUntil)

      // Можно отправить уведомление в Telegram
      // await sendTelegramNotification(telegramId, 'Спасибо за покупку! PRO активирован 🎉')
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// Функция для отправки уведомления в Telegram (опционально)
async function sendTelegramNotification(telegramId: number, message: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  
  if (!TELEGRAM_BOT_TOKEN) return

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramId,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}
