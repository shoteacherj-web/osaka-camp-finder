'use client'
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import type { Campsite } from '@/types'

type Props = {
  camp: Campsite
}

export function CampMap({ camp }: Props) {
  const position = { lat: camp.lat, lng: camp.lng }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-64 rounded-xl overflow-hidden">
        <Map
          defaultCenter={position}
          defaultZoom={13}
          gestureHandling="cooperative"
        >
          <Marker position={position} title={camp.name} />
        </Map>
      </div>
      <a
        href={`https://www.google.com/maps/dir/大阪駅/${camp.lat},${camp.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-2 text-sm text-center text-green-600 underline"
      >
        大阪駅からのルートを見る →
      </a>
    </APIProvider>
  )
}
