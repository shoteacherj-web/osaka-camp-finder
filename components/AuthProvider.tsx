'use client'
import { useEffect } from 'react'
import { ensureAnonymousAuth } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureAnonymousAuth().catch(err => console.error('Auth error:', err))
  }, [])
  return <>{children}</>
}
