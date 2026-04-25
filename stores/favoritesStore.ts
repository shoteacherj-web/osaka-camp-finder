import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesStore = {
  campIds: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      campIds: [],
      toggleFavorite: (id) => set((state) => ({
        campIds: state.campIds.includes(id)
          ? state.campIds.filter(c => c !== id)
          : [...state.campIds, id],
      })),
      isFavorite: (id) => get().campIds.includes(id),
    }),
    { name: 'osaka-camp-favorites' }
  )
)
