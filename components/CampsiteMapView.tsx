'use client'
import { useState } from 'react'
import Link from 'next/link'
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps'
import type { Campsite } from '@/types'

type Props = {
  camps: Campsite[]
}

const OSAKA_CENTER = { lat: 34.6937, lng: 135.5023 }

export function CampsiteMapView({ camps }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedCamp = camps.find((c) => c.id === selectedId) ?? null

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="h-full w-full">
        <Map
          defaultCenter={OSAKA_CENTER}
          defaultZoom={9}
          gestureHandling="cooperative"
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
              <div className="text-sm space-y-1">
                <p className="font-bold">{selectedCamp.name}</p>
                <p>{selectedCamp.area}</p>
                <p>¥{selectedCamp.price_min.toLocaleString()}〜</p>
                <Link
                  href={`/camps/${selectedCamp.id}`}
                  className="text-green-600 underline"
                >
                  詳細を見る
                </Link>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  )
}
