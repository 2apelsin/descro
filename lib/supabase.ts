import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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
