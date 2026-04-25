import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { VisitLog } from '@/types'

export function useVisitLogs(campsiteId?: string) {
  const [logs, setLogs] = useState<VisitLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('visit_logs')
      .select('*')
      .order('visit_date', { ascending: false })
    if (campsiteId) query = query.eq('campsite_id', campsiteId)
    const { data } = await query
    if (data) setLogs(data as VisitLog[])
    setLoading(false)
  }, [campsiteId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  async function addLog(log: Omit<VisitLog, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('visit_logs')
      .insert({ ...log, user_id: user?.id })
      .select()
      .single()
    if (data) setLogs(prev => [data as VisitLog, ...prev])
    return { data, error }
  }

  async function deleteLog(id: string) {
    const { error } = await supabase
      .from('visit_logs')
      .delete()
      .eq('id', id)
    if (!error) setLogs(prev => prev.filter(l => l.id !== id))
    return { error }
  }

  return { logs, loading, addLog, deleteLog, refetch: fetchLogs }
}
