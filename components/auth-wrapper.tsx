'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AuthModal } from './auth-modal'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    // Инициализируем Supabase только на клиенте
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      setSupabase(client)
    }
  }, [])

  useEffect(() => {
    if (supabase) {
      checkAuth()

      // Слушаем изменения авторизации
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile(session.user.id)
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

  const checkAuth = async () => {
    if (!supabase) return
    
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      await loadProfile(user.id)
    }
  }

  const loadProfile = async (userId: string) => {
    if (!supabase) return
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    setProfile(profile)
  }

  // Передаём данные через контекст
  return (
    <>
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        botUsername={process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || ''}
      />
    </>
  )
}
