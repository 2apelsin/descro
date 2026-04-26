import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Временный endpoint для ручной отмены подписки
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Обнуляем подписку и восстанавливаем бесплатный лимит
    const { error } = await supabase
      .from('users')
      .update({ 
        pro_until: null,
        generations_left: 3,
        last_reset: new Date().toISOString()
      })
      .eq('email', email)

    if (error) {
      console.error('[Admin] Failed to cancel subscription:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`[Admin] ✅ Subscription canceled for ${email}, restored 3 generations`)

    return NextResponse.json({ 
      success: true,
      message: 'Subscription canceled, restored to free plan (3 generations)'
    })

  } catch (error: any) {
    console.error('[Admin] Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
