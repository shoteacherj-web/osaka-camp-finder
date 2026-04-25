'use client'
import { useEffect } from 'react'
import { ensureAnonymousAuth } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ensureAnonymousAuth()
  }, [])
  return <>{children}</>
}
