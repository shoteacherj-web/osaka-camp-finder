'use client'
import { APIProvider } from '@vis.gl/react-google-maps'
import { useCamps } from '@/hooks/useCamps'
import { CampsiteMapView } from '@/components/CampsiteMapView'
import type { CampsiteFilter } from '@/types'

const ALL_FILTER: CampsiteFilter = {
  area: null,
  price_range: null,
  amenities: [],
  search: '',
}

export default function MapPage() {
  const { camps, loading } = useCamps(ALL_FILTER)

  return (
    <div className="flex flex-col h-[100dvh]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shrink-0">
        <div className="px-4 py-3">
          <h1 className="text-lg font-bold text-green-700">マップ</h1>
          {!loading && (
            <p className="text-xs text-gray-500">{camps.length}件のキャンプ場</p>
          )}
        </div>
      </header>

      <div className="flex-1 pb-16">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
            <div className="h-[calc(100dvh-56px-64px)]">
              <CampsiteMapView camps={camps} />
            </div>
          </APIProvider>
        )}
      </div>
    </div>
  )
}
