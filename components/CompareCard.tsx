import Link from 'next/link'
import type { Campsite } from '@/types'

type Props = {
  camp: Campsite
  index: 1 | 2
}

export function CompareCard({ camp, index }: Props) {
  return (
    <Link href={`/camps/${camp.id}`} className="block border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {camp.image_url ? (
        <img src={camp.image_url} alt={camp.name} className="w-full aspect-[4/3] object-cover" />
      ) : (
        <div className="w-full aspect-[4/3] bg-gradient-to-br from-green-900 to-green-500" />
      )}
      <div className="p-2">
        <p className="text-xs font-bold text-green-700 mb-0.5">{index === 1 ? '①' : '②'}</p>
        <p className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">{camp.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{camp.area}</p>
        <p className="text-xs font-medium text-green-700 mt-1">¥{camp.price_min.toLocaleString()}〜</p>
      </div>
    </Link>
  )
}
