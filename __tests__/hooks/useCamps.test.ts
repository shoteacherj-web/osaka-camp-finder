import { renderHook } from '@testing-library/react'
import { useCamps } from '@/hooks/useCamps'
import type { CampsiteFilter } from '@/types'

const defaultFilter: CampsiteFilter = {
  area: null,
  price_range: null,
  amenities: [],
  search: '',
}

describe('useCamps', () => {
  it('フィルターなしで全20件返す', () => {
    const { result } = renderHook(() => useCamps(defaultFilter))
    expect(result.current.length).toBe(20)
  })

  it('エリアでフィルタリングできる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, area: '大阪' }))
    expect(result.current.every(c => c.area === '大阪')).toBe(true)
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('budget（〜2,000円）でフィルタリングできる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'budget' }))
    expect(result.current.every(c => c.price_min <= 2000)).toBe(true)
  })

  it('mid（2,001〜4,000円）でフィルタリングできる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'mid' }))
    expect(result.current.every(c => c.price_min >= 2001 && c.price_min <= 4000)).toBe(true)
  })

  it('premium（4,001円〜）でフィルタリングできる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, price_range: 'premium' }))
    expect(result.current.every(c => c.price_min >= 4001)).toBe(true)
  })

  it('設備（shower）でフィルタリングできる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, amenities: ['shower'] }))
    expect(result.current.every(c => c.amenities.includes('shower'))).toBe(true)
  })

  it('複数設備のAND検索ができる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, amenities: ['shower', 'power'] }))
    expect(result.current.every(c =>
      c.amenities.includes('shower') && c.amenities.includes('power')
    )).toBe(true)
  })

  it('名前で検索できる', () => {
    const { result } = renderHook(() => useCamps({ ...defaultFilter, search: 'マキノ' }))
    expect(result.current.some(c => c.name.includes('マキノ'))).toBe(true)
  })

  it('エリアと設備を組み合わせてフィルタリングできる', () => {
    const { result } = renderHook(() =>
      useCamps({ area: '滋賀', price_range: null, amenities: ['shower'], search: '' })
    )
    expect(result.current.every(c => c.area === '滋賀' && c.amenities.includes('shower'))).toBe(true)
  })
})
