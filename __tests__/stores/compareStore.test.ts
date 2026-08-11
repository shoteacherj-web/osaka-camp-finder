import { act, renderHook } from '@testing-library/react'
import { useCompareStore } from '@/stores/compareStore'

beforeEach(() => {
  useCompareStore.setState({ campIds: [] })
})

describe('useCompareStore', () => {
  it('初期状態は空', () => {
    const { result } = renderHook(() => useCompareStore())
    expect(result.current.campIds).toEqual([])
  })

  it('addCamp でキャンプ場を追加できる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    expect(result.current.campIds).toEqual(['camp-001'])
  })

  it('複数件追加できる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    act(() => result.current.addCamp('camp-003'))
    expect(result.current.campIds).toEqual(['camp-001', 'camp-002', 'camp-003'])
  })

  it('同じキャンプ場は重複しない', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-001'))
    expect(result.current.campIds).toEqual(['camp-001'])
  })

  it('removeCamp でキャンプ場を削除できる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    act(() => result.current.removeCamp('camp-001'))
    expect(result.current.campIds).toEqual(['camp-002'])
  })

  it('clearAll で全件クリアされる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    act(() => result.current.clearAll())
    expect(result.current.campIds).toEqual([])
  })
})
