import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompareStore = {
  campIds: string[]
  isReady: boolean
  addCamp: (id: string) => void
  removeCamp: (id: string) => void
  clearCompare: () => void
  markNavigated: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      campIds: [],
      isReady: false,
      addCamp: (id) => set((state) => {
        if (state.campIds.includes(id)) return state
        let newIds: string[]
        if (state.campIds.length >= 2) {
          newIds = [state.campIds[0], id]
        } else {
          newIds = [...state.campIds, id]
        }
        return { campIds: newIds, isReady: newIds.length === 2 }
      }),
      removeCamp: (id) => set((state) => {
        const newIds = state.campIds.filter(c => c !== id)
        return { campIds: newIds, isReady: newIds.length === 2 }
      }),
      clearCompare: () => set({ campIds: [], isReady: false }),
      markNavigated: () => set({ isReady: false }),
    }),
    { name: 'osaka-camp-compare' }
  )
)
