import { createClient } from '@supabase/supabase-js'
import { getSupabaseClient } from './supabase-client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

// Клиент для использования на клиенте (браузер) - используем singleton
export const supabase = typeof window !== 'undefined' 
  ? getSupabaseClient() 
  : null

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
