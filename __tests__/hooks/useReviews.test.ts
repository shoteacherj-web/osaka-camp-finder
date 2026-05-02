import { renderHook, waitFor } from '@testing-library/react'
import { useReviews } from '@/hooks/useReviews'

const mockReviews = [
  { id: 'r-1', campsite_id: 'camp-1', rating: 4, comment: '良かった', visit_date: '2026-04-01', created_at: '2026-04-02T00:00:00Z' },
]

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: mockReviews, error: null }),
        }),
      }),
    }),
  },
}))

describe('useReviews', () => {
  it('口コミを取得してロードが完了する', async () => {
    const { result } = renderHook(() => useReviews('camp-1'))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.reviews).toHaveLength(1)
    expect(result.current.reviews[0].comment).toBe('良かった')
  })
})
