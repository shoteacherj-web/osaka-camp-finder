import { renderHook, waitFor } from '@testing-library/react'
import { useCamps } from '@/hooks/useCamps'
import type { CampsiteFilter } from '@/types'

const mockSelect = jest.fn()
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({ select: mockSelect })),
  },
}))

const mockCamps = [
  {
    id: 'camp-001', name: 'テストキャンプ場', area: '大阪' as const,
    price_min: 1000, amenities: ['toilet'], address: '大阪府', lat: 34.7, lng: 135.5,
    booking_url: 'https://example.com', image_url: '', description: '', pros: [], cons: [],
  },
  {
    id: 'camp-002', name: 'シャワーキャンプ', area: '兵庫' as const,
    price_min: 3000, amenities: ['toilet', 'shower'], address: '兵庫県', lat: 34.8, lng: 135.2,
    booking_url: 'https://example.com', image_url: '', description: '', pros: [], cons: [],
  },
  {
    id: 'camp-003', name: '高級キャンプ', area: '京都' as const,
    price_min: 5000, amenities: ['toilet', 'shower', 'power'], address: '京都府', lat: 35.0, lng: 135.7,
    booking_url: 'https://example.com', image_url: '', description: '', pros: [], cons: [],
  },
]

const defaultFilter: CampsiteFilter = { area: null, price_range: null, amenities: [], search: '' }

beforeEach(() => {
  mockSelect.mockResolvedValue({ data: mockCamps, error: null })
})

describe('useCamps', () => {
  it('初期状態はloading: true', () => {
    const { result } = renderHook(() => useCamps(defaultFilter))
    expect(result.current.loading).toBe(true)
  })

  it('フィルターなしで全件返す', async () => {
    const { result } = renderHook(() => useCamps(defaultFilter))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.length).toBe(3)
  })

  it('エリアでフィルタリングできる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, area: '大阪' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.every(c => c.area === '大阪')).toBe(true)
    expect(result.current.camps.length).toBe(1)
  })

  it('budget（〜2,000円）でフィルタリングできる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'budget' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.every(c => c.price_min <= 2000)).toBe(true)
  })

  it('mid（2,001〜4,000円）でフィルタリングできる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'mid' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.every(c => c.price_min >= 2001 && c.price_min <= 4000)).toBe(true)
  })

  it('premium（4,001円〜）でフィルタリングできる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'premium' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.every(c => c.price_min >= 4001)).toBe(true)
  })

  it('設備（shower）でフィルタリングできる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, amenities: ['shower'] }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.every(c => c.amenities.includes('shower'))).toBe(true)
  })

  it('名前で検索できる', async () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, search: 'シャワー' }))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.camps.some(c => c.name.includes('シャワー'))).toBe(true)
  })
})
