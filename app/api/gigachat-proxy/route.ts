import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

const GIGACHAT_AUTH = process.env.GIGACHAT_CLIENT_SECRET || ''

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function getToken() {
  try {
    const res = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${GIGACHAT_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
      // @ts-ignore - Vercel Edge не поддерживает, но попробуем
      agent: false,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Auth error: ${res.status}`)
    }

    const data = await res.json()
    return data.access_token
  } catch (error) {
    console.error('[Proxy] Token error:', error)
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'GigaChat' } = await req.json()

    const token = await getToken()

    const res = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'RqUID': randomUUID(),
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'Ты — эксперт по маркетплейсам с опытом 5+ лет. Пишешь продающие тексты для Ozon и Wildberries. Знаешь SEO и психологию покупателей. Отвечаешь ТОЛЬКО валидным JSON без markdown.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
      // @ts-ignore
      agent: false,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`GigaChat error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('[Proxy] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
