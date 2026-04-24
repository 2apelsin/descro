import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Твой ключ из кабинета Сбера (уже в base64)
const GIGACHAT_AUTH = 'MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA=='

async function getToken() {
  console.log('[GigaChat] Requesting token...')
  
  const res = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${GIGACHAT_AUTH}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'RqUID': randomUUID(),
    },
    body: 'scope=GIGACHAT_API_PERS',
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[GigaChat] Auth error:', res.status, text)
    throw new Error(`Auth error: ${res.status} — ${text}`)
  }

  const data = await res.json()
  console.log('[GigaChat] ✓ Token received')
  return data.access_token
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

    // Проверяем авторизацию
    const authHeader = req.headers.get('authorization')
    let user = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = await verifyToken(token)
      
      if (payload) {
        // Получаем профиль пользователя
        const { data: profile } = await supabase
          .from('teleg')
          .select('*')
          .eq('telegram_id', payload.telegram_id)
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
    }

    console.log('[API] Getting token...')
    const token = await getToken()

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
    const res = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[GigaChat] API error:', res.status, text)
      throw new Error(`GigaChat error: ${res.status}`)
    }

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
        await supabase
          .from('teleg')
          .update({ generations_left: user.generations_left - 1 })
          .eq('telegram_id', user.telegram_id)
      }
      
      // Сохраняем в историю
      await supabase
        .from('generations')
        .insert({
          user_id: user.telegram_id,
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
