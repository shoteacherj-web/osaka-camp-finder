import { create } from 'zustand'

type CompareStore = {
  campIds: [] | [string] | [string, string]
  isReady: boolean
  addCamp: (id: string) => void
  removeCamp: (id: string) => void
  clearCompare: () => void
}

export const useCompareStore = create<CompareStore>((set) => ({
  campIds: [],
  isReady: false,
  addCamp: (id) => set((state) => {
    if (state.campIds.includes(id)) return state
    if (state.campIds.length === 0) return { campIds: [id], isReady: false }
    const newIds: [string, string] = [state.campIds[0], id]
    return { campIds: newIds, isReady: true }
  }),
  removeCamp: (id) => set((state) => {
    const filtered = state.campIds.filter(c => c !== id) as [] | [string]
    return { campIds: filtered, isReady: false }
  }),
  clearCompare: () => set({ campIds: [], isReady: false }),
}))
