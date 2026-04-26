'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type User = {
  id: string
  email: string
  name: string
  generations_left: number
  pro_until: string | null
  last_reset: string
  created_at: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUser() {
    try {
      // Токен теперь в httpOnly cookie, браузер отправит автоматически
      const res = await fetch('/api/auth/me', {
        credentials: 'include' // Важно для отправки cookies
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    }
  }

  async function login() {
    // После успешного login/register API уже установил cookie
    await fetchUser()
  }

  async function logout() {
    try {
      // Вызываем API для удаления cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    setUser(null)
    window.location.reload()
  }

  async function refreshUser() {
    await fetchUser()
  }

  useEffect(() => {
    // При загрузке проверяем есть ли cookie (браузер отправит автоматически)
    fetchUser().finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
