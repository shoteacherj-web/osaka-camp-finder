import { act, renderHook } from '@testing-library/react'
import { useCompareStore } from '@/stores/compareStore'

beforeEach(() => {
  useCompareStore.setState({ campIds: [], isReady: false })
})

describe('useCompareStore', () => {
  it('初期状態は空', () => {
    const { result } = renderHook(() => useCompareStore())
    expect(result.current.campIds).toEqual([])
    expect(result.current.isReady).toBe(false)
  })

  it('1件追加できる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    expect(result.current.campIds).toEqual(['camp-001'])
    expect(result.current.isReady).toBe(false)
  })

  it('2件揃うと isReady が true になる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    expect(result.current.campIds).toEqual(['camp-001', 'camp-002'])
    expect(result.current.isReady).toBe(true)
  })

  it('2件ある状態で別のキャンプを追加すると2件目が置き換わる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    act(() => result.current.addCamp('camp-003'))
    expect(result.current.campIds).toEqual(['camp-001', 'camp-003'])
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
    act(() => result.current.removeCamp('camp-001'))
    expect(result.current.campIds).toEqual([])
  })

  it('clearCompare で全件クリアされる', () => {
    const { result } = renderHook(() => useCompareStore())
    act(() => result.current.addCamp('camp-001'))
    act(() => result.current.addCamp('camp-002'))
    act(() => result.current.clearCompare())
    expect(result.current.campIds).toEqual([])
    expect(result.current.isReady).toBe(false)
  })
})
