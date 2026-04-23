'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type User = {
  telegram_id: number
  username: string | null
  first_name: string | null
  generations_left: number
  pro_until: string | null
  last_reset: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchUser(token: string) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        localStorage.removeItem('descro_token')
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    }
  }

  async function login(token: string) {
    localStorage.setItem('descro_token', token)
    await fetchUser(token)
  }

  function logout() {
    localStorage.removeItem('descro_token')
    setUser(null)
    window.location.reload()
  }

  async function refreshUser() {
    const token = localStorage.getItem('descro_token')
    if (token) {
      await fetchUser(token)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('descro_token')
    if (token) {
      fetchUser(token).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
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
