'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

type Generation = {
  id: number
  title: string
  created_at: string
}

export function GenerationHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchHistory() {
      try {
        // Токен в httpOnly cookie, браузер отправит автоматически
        const res = await fetch('/api/generations', {
          credentials: 'include'
        })
        
        if (res.ok) {
          const data = await res.json()
          setHistory(data.generations || [])
        }
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  if (!user) return null

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-lg font-semibold text-white">История генераций</h3>
      
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <p className="text-sm text-white/60">Пока нет сгенерированных описаний</p>
      ) : (
        <div className="space-y-2">
          {history.map(gen => (
            <div key={gen.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-sm text-white">{gen.title}</p>
              <p className="mt-1 text-xs text-white/50">
                {new Date(gen.created_at).toLocaleString('ru-RU')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
