import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/types'

export function useReviews(campsiteId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('campsite_id', campsiteId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? [])
        setLoading(false)
      })
  }, [campsiteId])

  return { reviews, loading }
}
