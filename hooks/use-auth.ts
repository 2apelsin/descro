'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Инициализируем Supabase только на клиенте
    if (typeof window !== 'undefined') {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      setSupabase(client)
    }
  }, [])

  useEffect(() => {
    if (supabase) {
      checkAuth()

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile(session.user.id)
        } else {
          setProfile(null)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  const checkAuth = async () => {
    if (!supabase) return
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await loadProfile(user.id)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    if (!supabase) return
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      setProfile(profile)
    } catch (error) {
      console.error('Profile load error:', error)
    }
  }

  const isPro = profile?.pro_until && new Date(profile.pro_until) > new Date()
  const generationsLeft = profile?.generations_left || 0

  return {
    user,
    profile,
    loading,
    isPro,
    generationsLeft,
    refreshProfile: () => user && supabase && loadProfile(user.id)
  }
}
