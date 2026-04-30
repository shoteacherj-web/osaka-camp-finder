import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompareStore = {
  campIds: string[]
  addCamp: (id: string) => void
  removeCamp: (id: string) => void
  clearAll: () => void
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      campIds: [],
      addCamp: (id) => set((state) => ({
        campIds: state.campIds.includes(id) ? state.campIds : [...state.campIds, id],
      })),
      removeCamp: (id) => set((state) => ({
        campIds: state.campIds.filter(c => c !== id),
      })),
      clearAll: () => set({ campIds: [] }),
    }),
    { name: 'osaka-camp-favorites' }
  )
)
