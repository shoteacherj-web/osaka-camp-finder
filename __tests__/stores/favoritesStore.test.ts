import { act, renderHook } from '@testing-library/react'
import { useFavoritesStore } from '@/stores/favoritesStore'

beforeEach(() => {
  useFavoritesStore.setState({ campIds: [] })
})

describe('useFavoritesStore', () => {
  it('初期状態は空', () => {
    const { result } = renderHook(() => useFavoritesStore())
    expect(result.current.campIds).toEqual([])
  })

  it('toggleFavorite でお気に入り追加', () => {
    const { result } = renderHook(() => useFavoritesStore())
    act(() => result.current.toggleFavorite('camp-001'))
    expect(result.current.campIds).toContain('camp-001')
  })

  it('toggleFavorite を2回押すとお気に入り解除', () => {
    const { result } = renderHook(() => useFavoritesStore())
    act(() => result.current.toggleFavorite('camp-001'))
    act(() => result.current.toggleFavorite('camp-001'))
    expect(result.current.campIds).not.toContain('camp-001')
  })

  it('isFavorite が正しく返る', () => {
    const { result } = renderHook(() => useFavoritesStore())
    act(() => result.current.toggleFavorite('camp-001'))
    expect(result.current.isFavorite('camp-001')).toBe(true)
    expect(result.current.isFavorite('camp-002')).toBe(false)
  })
})
