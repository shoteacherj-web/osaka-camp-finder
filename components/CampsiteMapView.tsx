'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import type { Campsite } from '@/types'

type Props = {
  camps: Campsite[]
}

const OSAKA_CENTER = { lat: 34.6937, lng: 135.5023 }

export function CampsiteMapView({ camps }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedCamp = camps.find((c) => c.id === selectedId) ?? null

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={OSAKA_CENTER}
        defaultZoom={9}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {camps.map((camp) => (
          <AdvancedMarker
            key={camp.id}
            position={{ lat: camp.lat, lng: camp.lng }}
            title={camp.name}
            onClick={() => setSelectedId(camp.id)}
          />
        ))}

        {selectedCamp && (
          <InfoWindow
            position={{ lat: selectedCamp.lat, lng: selectedCamp.lng }}
            onCloseClick={() => setSelectedId(null)}
          >
            <div className="space-y-1 text-sm min-w-[160px]">
              <p className="font-bold text-gray-900">{selectedCamp.name}</p>
              <p className="text-gray-500">{selectedCamp.area}</p>
              <p className="font-medium text-green-700">¥{selectedCamp.price_min.toLocaleString()}〜</p>
              <Link
                href={`/camps/${selectedCamp.id}`}
                className="block mt-2 text-center text-xs text-white bg-green-600 px-3 py-1.5 rounded-lg"
              >
                詳細を見る
              </Link>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  )
}
