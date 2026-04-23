import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// Твой ключ из кабинета Сбера (уже в base64)
const GIGACHAT_AUTH = 'MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA=='

export async function GET(req: NextRequest) {
  try {
    console.log('[TEST] Step 1: Getting token...')
    
    const tokenRes = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${GIGACHAT_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
    })

    if (!tokenRes.ok) {
      const text = await tokenRes.text()
      console.error('[TEST] Token error:', tokenRes.status, text)
      return NextResponse.json({
        success: false,
        step: 'token',
        status: tokenRes.status,
        error: text
      })
    }

    const tokenData = await tokenRes.json()
    console.log('[TEST] ✓ Token received')

    console.log('[TEST] Step 2: Testing GigaChat API...')
    
    const chatRes = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
        'RqUID': randomUUID(),
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'user', content: 'Скажи "Привет"' }
        ],
      }),
    })

    if (!chatRes.ok) {
      const text = await chatRes.text()
      console.error('[TEST] Chat error:', chatRes.status, text)
      return NextResponse.json({
        success: false,
        step: 'chat',
        status: chatRes.status,
        error: text
      })
    }

    const chatData = await chatRes.json()
    console.log('[TEST] ✓ GigaChat response received')

    return NextResponse.json({
      success: true,
      message: 'GigaChat работает!',
      response: chatData.choices?.[0]?.message?.content
    })
  } catch (error: any) {
    console.error('[TEST] Error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
