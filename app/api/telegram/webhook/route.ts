import { NextRequest, NextResponse } from 'next/server'

const SITE_URL = process.env.SITE_URL || 'https://descro-production.up.railway.app'
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU'

// Функция отправки сообщения через Telegram API
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup: replyMarkup,
      parse_mode: 'HTML'
    })
  })

  return response.json()
}

// Webhook endpoint для Telegram
export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    
    // Обработка команды /start
    if (update.message?.text?.startsWith('/start')) {
      const chatId = update.message.chat.id
      const user = update.message.from

      console.log(`📥 /start from user ${user.id} (${user.username || user.first_name})`)

      // Создаём прямую ссылку для авторизации
      const siteUrl = SITE_URL.includes('localhost') ? 'https://descro-production.up.railway.app' : SITE_URL
      const loginUrl = `${siteUrl}/api/auth/demo-login?telegram_id=${user.id}&username=${encodeURIComponent(user.username || '')}&first_name=${encodeURIComponent(user.first_name || '')}`

      await sendMessage(
        chatId,
        `👋 Привет, ${user.first_name}!\n\n` +
        `Добро пожаловать в Descro — AI-генератор описаний для маркетплейсов!\n\n` +
        `🎁 Получите 3 бесплатные генерации в день\n` +
        `⚡ Или активируйте PRO за 199₽/мес\n\n` +
        `Нажмите на кнопку ниже чтобы войти на сайт:`,
        {
          inline_keyboard: [[
            { text: '🔐 Войти на сайт', url: loginUrl }
          ]]
        }
      )

      console.log(`✅ Login link sent to user ${user.id}`)
    }
    
    // Обработка команды /help
    else if (update.message?.text?.startsWith('/help')) {
      const chatId = update.message.chat.id

      await sendMessage(
        chatId,
        `📖 Помощь по боту Descro\n\n` +
        `Команды:\n` +
        `/start — Войти на сайт\n` +
        `/help — Показать эту справку\n\n` +
        `Если у вас возникли проблемы, напишите на support@descro.ru`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

// GET endpoint для проверки webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Telegram webhook is running',
    timestamp: new Date().toISOString()
  })
}
