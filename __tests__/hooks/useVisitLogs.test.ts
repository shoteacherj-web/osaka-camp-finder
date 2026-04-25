import { renderHook, waitFor } from '@testing-library/react'
import { useVisitLogs } from '@/hooks/useVisitLogs'

const mockLog = {
  id: 'log-001',
  user_id: 'user-001',
  campsite_id: 'camp-001',
  visit_date: '2026-04-01',
  rating: 4,
  memo: 'よかった',
  photos: [],
  created_at: '2026-04-01T10:00:00Z',
}

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [mockLog], error: null }),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockLog, error: null }),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-001' } } }),
    },
  },
}))

describe('useVisitLogs', () => {
  it('ログを取得できる', async () => {
    const { result } = renderHook(() => useVisitLogs())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.logs).toHaveLength(1)
    expect(result.current.logs[0].id).toBe('log-001')
  })
})
