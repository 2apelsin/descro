import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import https from 'https'
import { supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Твой ключ из кабинета Сбера (уже в base64)
const GIGACHAT_AUTH = 'MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA=='
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

// Custom HTTPS agent только для GigaChat (безопаснее чем NODE_TLS_REJECT_UNAUTHORIZED=0)
const gigachatAgent = new https.Agent({
  rejectUnauthorized: false, // Только для GigaChat API, не влияет на другие запросы
})

// Retry helper с экспоненциальной задержкой
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      const isLastAttempt = i === retries
      
      // Не повторяем для клиентских ошибок (4xx кроме 429)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error
      }
      
      if (isLastAttempt) {
        throw error
      }
      
      // Экспоненциальная задержка: 1s, 2s, 4s...
      const waitTime = delay * Math.pow(2, i)
      console.log(`[Retry] Attempt ${i + 1} failed, retrying in ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  throw new Error('Retry failed')
}

async function getToken() {
  console.log('[GigaChat] Requesting token...')
  
  return retryWithBackoff(async () => {
    const res = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${GIGACHAT_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': randomUUID(),
      },
      body: 'scope=GIGACHAT_API_PERS',
      // @ts-ignore - Node.js specific agent
      agent: gigachatAgent,
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[GigaChat] Auth error:', res.status, text)
      const error: any = new Error(`Auth error: ${res.status} — ${text}`)
      error.status = res.status
      throw error
    }

    const data = await res.json()
    console.log('[GigaChat] ✓ Token received')
    return data.access_token
  })
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, features } = await req.json()

    console.log('\n[API] === NEW REQUEST ===')
    console.log('[API] Name:', name)
    console.log('[API] Category:', category)

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'Заполни название и категорию' },
        { status: 400 }
      )
    }

    // Проверяем авторизацию - читаем JWT токен из cookie или header
    let authToken = req.cookies.get('auth_token')?.value
    
    if (!authToken) {
      const authHeader = req.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7)
      }
    }
    
    let user = null
    
    if (authToken) {
      try {
        const payload: any = jwt.verify(authToken, JWT_SECRET)
      
        if (payload) {
          // Получаем профиль пользователя из новой таблицы users
          const { data: profile } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', payload.userId)
            .single()
          
          if (profile) {
            user = profile
            
            // Проверяем PRO статус
            const isPro = profile.pro_until && new Date(profile.pro_until) > new Date()
            
            if (!isPro) {
              // Проверяем лимит
              if (profile.generations_left <= 0) {
                return NextResponse.json(
                  { success: false, error: 'Лимит исчерпан. Получите PRO доступ.' },
                  { status: 403 }
                )
              }
            }
          }
        }
      } catch (error) {
        console.error('[API] Token verification error:', error)
      }
    }

    console.log('[API] Getting GigaChat token...')
    const gigachatToken = await getToken()

    const prompt = `Ты — эксперт по маркетплейсам Ozon и Wildberries. Создай продающее описание товара.

ТОВАР:
Название: ${name}
Категория: ${category}
Характеристики: ${features || 'не указаны'}

ТРЕБОВАНИЯ:
1. Заголовок (title): до 60 символов, с ключевыми словами для SEO, без воды
2. Буллеты (bullets): 5 коротких фраз, каждая — конкретная выгода или характеристика
3. Описание (description): 300-500 символов, продающий текст с эмодзи, структурированный
4. Ключевые слова (keywords): 8-10 слов для поиска, через запятую

СТИЛЬ: конкретно, без воды, с цифрами и фактами, продающий тон

Верни ТОЛЬКО JSON без markdown:
{
  "title": "заголовок",
  "bullets": ["буллет 1", "буллет 2", "буллет 3", "буллет 4", "буллет 5"],
  "description": "описание",
  "keywords": "слово1, слово2, слово3"
}`

    console.log('[API] Calling GigaChat API...')
    const res = await retryWithBackoff(async () => {
      const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gigachatToken}`,
          'Content-Type': 'application/json',
          'RqUID': randomUUID(),
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'GigaChat',
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
        // @ts-ignore - Node.js specific agent
        agent: gigachatAgent,
      })

      if (!response.ok) {
        const text = await response.text()
        console.error('[GigaChat] API error:', response.status, text)
        const error: any = new Error(`GigaChat error: ${response.status}`)
        error.status = response.status
        throw error
      }

      return response
    }, 2, 1000) // 2 retry, начиная с 1 секунды

    const data = await res.json()
    console.log('[GigaChat] ✓ Response received')
    
    let content = data.choices?.[0]?.message?.content || ''

    // Убираем ```json ... ``` если GigaChat обернул в markdown
    content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim()

    let parsed
    try {
      parsed = JSON.parse(content)
      console.log('[API] ✓ JSON parsed successfully')
    } catch (e) {
      console.error('[API] JSON parse error:', e)
      parsed = {
        title: name,
        bullets: ['Ошибка парсинга'],
        description: content,
        keywords: ''
      }
    }

    // Если пользователь авторизован - уменьшаем счётчик и сохраняем в историю
    if (user) {
      const isPro = user.pro_until && new Date(user.pro_until) > new Date()
      
      if (!isPro) {
        // Уменьшаем счётчик
        await supabaseAdmin
          .from('users')
          .update({ generations_left: user.generations_left - 1 })
          .eq('id', user.id)
      }
      
      // Сохраняем в историю
      await supabaseAdmin
        .from('generations')
        .insert({
          user_id: user.id,
          title: parsed.title
        })
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: any) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
