'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCamp } from '@/hooks/useCamp'
import { useWeather } from '@/hooks/useWeather'
import { useVisitLogs } from '@/hooks/useVisitLogs'
import { useCompareStore } from '@/stores/compareStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { WeatherWidget } from '@/components/WeatherWidget'
import { CampMap } from '@/components/CampMap'
import { VisitLogCard } from '@/components/VisitLogCard'

const AMENITY_LABELS: Record<string, string> = {
  toilet: 'トイレ',
  shower: 'シャワー',
  power: '電源',
  pet: 'ペット可',
}

export default function CampDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { camp, loading: campLoading } = useCamp(id)

  const { forecast, loading: weatherLoading } = useWeather(id)
  const { logs, deleteLog } = useVisitLogs(id)
  const { campIds, addCamp, removeCamp } = useCompareStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  if (campLoading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
          <button type="button" onClick={() => router.back()} className="text-green-600 shrink-0">← 戻る</button>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-full aspect-video bg-gray-200 animate-pulse" />
        <div className="px-4 py-4 space-y-3">
          <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (!camp) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">キャンプ場が見つかりません</p>
          <button type="button" onClick={() => router.back()} className="text-green-600 text-sm">← 戻る</button>
        </div>
      </div>
    )
  }

  const inCompare = campIds.some(c => c === id)
  const favorite = isFavorite(id)

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <button type="button" onClick={() => router.back()} className="text-green-600 shrink-0">← 戻る</button>
        <h1 className="font-bold text-gray-900 truncate">{camp.name}</h1>
      </div>

      {camp.image_url ? (
        <img src={camp.image_url} alt={camp.name} className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-green-900 to-green-500" />
      )}

      <div className="px-4 py-4 space-y-4">
        <section className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{camp.area}</span>
            {camp.amenities.map(a => (
              <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {AMENITY_LABELS[a] ?? a}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">{camp.address}</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">
            ¥{camp.price_min.toLocaleString()}〜{camp.price_max ? `¥${camp.price_max.toLocaleString()}` : ''} /泊
          </p>

          {camp.description && (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{camp.description}</p>
          )}
          {(camp.pros.length > 0 || camp.cons.length > 0) && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {camp.pros.length > 0 && (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-green-700 mb-1.5">👍 良いところ</p>
                  <ul className="space-y-1">
                    {camp.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-gray-700 leading-snug">・{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              {camp.cons.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-orange-700 mb-1.5">👎 イマイチ</p>
                  <ul className="space-y-1">
                    {camp.cons.map((con, i) => (
                      <li key={i} className="text-xs text-gray-700 leading-snug">・{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => inCompare ? removeCamp(id) : addCamp(id)}
              className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition-colors ${inCompare ? 'bg-green-600 text-white border-green-600' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
            >
              {inCompare ? '✓ 比較リストに追加済み' : '+ 比較リストに追加'}
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(id)}
              className={`px-4 py-2.5 text-sm rounded-xl border font-medium ${favorite ? 'bg-yellow-400 text-white border-yellow-400' : 'border-gray-200 text-gray-600'}`}
            >
              {favorite ? '★' : '☆'}
            </button>
          </div>
          <a
            href={camp.booking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 text-center text-sm bg-green-600 text-white py-3 rounded-xl font-semibold"
          >
            予約サイトへ →
          </a>
        </section>

        <section className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">アクセス</h2>
          <CampMap camp={camp} />
        </section>

        <section className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">天気予報（7日間）</h2>
          <WeatherWidget forecast={forecast} loading={weatherLoading} />
        </section>

        <section className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-gray-900">訪問記録</h2>
            <Link href={`/logs/new?campsite=${id}`} className="text-sm text-green-600 font-medium">
              + 追加
            </Link>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400">まだ訪問記録がありません</p>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <VisitLogCard key={log.id} log={log} onDelete={deleteLog} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
