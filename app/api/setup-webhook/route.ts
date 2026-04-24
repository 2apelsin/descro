import { NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU'
const SITE_URL = process.env.SITE_URL || 'https://descro-production.up.railway.app'

export async function GET() {
  try {
    const webhookUrl = `${SITE_URL}/api/telegram/webhook`
    const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl })
    })

    const data = await response.json()

    if (data.ok) {
      return NextResponse.json({
        success: true,
        message: '✅ Webhook установлен!',
        webhook_url: webhookUrl,
        telegram_response: data
      })
    } else {
      return NextResponse.json({
        success: false,
        error: data.description,
        telegram_response: data
      }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
