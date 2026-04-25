import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { VisitLog } from '@/types'

export function useVisitLogs(campsiteId?: string) {
  const [logs, setLogs] = useState<VisitLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from('visit_logs')
      .select('*')
      .order('visit_date', { ascending: false })
    if (campsiteId) query = query.eq('campsite_id', campsiteId)
    const { data, error: fetchError } = await query
    if (fetchError) {
      setError(new Error(fetchError.message))
    } else if (data) {
      setLogs(data as VisitLog[])
    }
    setLoading(false)
  }, [campsiteId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const addLog = useCallback(async (log: Omit<VisitLog, 'id' | 'user_id' | 'created_at'>) => {
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData.user) return { data: null, error: authError ?? new Error('Not authenticated') }
    const { data, error } = await supabase
      .from('visit_logs')
      .insert({ ...log, user_id: authData.user.id })
      .select()
      .single()
    if (data) setLogs(prev => [data as VisitLog, ...prev])
    return { data, error }
  }, [])

  const deleteLog = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('visit_logs')
      .delete()
      .eq('id', id)
    if (!error) setLogs(prev => prev.filter(l => l.id !== id))
    return { error }
  }, [])

  return { logs, loading, error, addLog, deleteLog, refetch: fetchLogs }
}
