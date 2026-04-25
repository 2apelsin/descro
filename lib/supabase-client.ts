'use client'

import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return null
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }
  }

  return supabaseInstance
}
