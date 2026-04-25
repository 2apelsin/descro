import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

// Клиент для использования на клиенте (браузер) - с ANON ключом
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Клиент для использования на сервере - с SERVICE_ROLE ключом
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Profile = {
  telegram_id: number
  username: string | null
  first_name: string | null
  generations_left: number
  last_reset: string
  pro_until: string | null
  created_at: string
}

export type Generation = {
  id: number
  user_id: number
  title: string
  created_at: string
}
