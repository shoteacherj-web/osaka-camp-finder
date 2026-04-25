'use client'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import campsData from '@/data/camps.json'
import { useWeather } from '@/hooks/useWeather'
import { useVisitLogs } from '@/hooks/useVisitLogs'
import { useCompareStore } from '@/stores/compareStore'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { WeatherWidget } from '@/components/WeatherWidget'
import { CampMap } from '@/components/CampMap'
import { VisitLogCard } from '@/components/VisitLogCard'
import type { Campsite } from '@/types'

const AMENITY_LABELS: Record<string, string> = {
  toilet: 'トイレ',
  shower: 'シャワー',
  power: '電源',
  pet: 'ペット可',
}

export default function CampDetailPage() {
  const { id } = useParams<{ id: string }>()
  const camp = (campsData as Campsite[]).find(c => c.id === id)

  const { forecast, loading: weatherLoading } = useWeather(id)
  const { logs, deleteLog } = useVisitLogs(id)
  const { addCamp, isReady, campIds, clearCompare } = useCompareStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()

  useEffect(() => {
    if (isReady) {
      alert('もう1件選択されました。比較機能はPhase 2で実装予定です。')
      clearCompare()
    }
  }, [isReady, clearCompare])

  if (!camp) return notFound()

  const inCompare = (campIds as string[]).includes(id)
  const favorite = isFavorite(id)

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <Link href="/" className="text-green-600 shrink-0">← 戻る</Link>
        <h1 className="font-bold text-gray-900 truncate">{camp.name}</h1>
      </div>

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
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => addCamp(id)}
              disabled={inCompare}
              className={`flex-1 py-2.5 text-sm rounded-xl border font-medium ${inCompare ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
            >
              {inCompare ? '比較に追加済み' : '比較に追加'}
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
