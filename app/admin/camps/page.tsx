'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Campsite } from '@/types'

export default function AdminCampsPage() {
  const router = useRouter()
  const [camps, setCamps] = useState<Campsite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchCamps() {
    try {
      const res = await fetch('/api/admin/camps')
      if (res.status === 401) { router.push('/admin'); return }
      if (!res.ok) { setError(`エラー: ${res.status}`); setLoading(false); return }
      setCamps(await res.json())
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCamps() }, [])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を削除しますか？`)) return
    await fetch(`/api/admin/camps/${id}`, { method: 'DELETE' })
    setCamps(prev => prev.filter(c => c.id !== id))
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center z-10">
        <h1 className="font-bold text-gray-900">キャンプ場管理</h1>
        <div className="flex gap-3 items-center">
          <Link href="/admin/camps/new"
            className="text-sm bg-green-600 text-white px-4 py-2 rounded-xl font-medium">
            + 追加
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600">
            ログアウト
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchCamps} className="mt-4 text-sm text-green-600 underline">再読み込み</button>
          </div>
        ) : camps.length === 0 ? (
          <p className="text-center text-gray-400 py-16">キャンプ場がありません</p>
        ) : (
          camps.map(camp => (
            <div key={camp.id} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{camp.name}</p>
                <p className="text-xs text-gray-400">{camp.area} · ¥{camp.price_min.toLocaleString()}〜</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/camps/${camp.id}/edit`}
                  className="text-xs text-green-600 border border-green-600 px-3 py-1.5 rounded-lg font-medium">
                  編集
                </Link>
                <button onClick={() => handleDelete(camp.id, camp.name)}
                  className="text-xs text-red-400 border border-red-200 px-3 py-1.5 rounded-lg font-medium hover:bg-red-50">
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
