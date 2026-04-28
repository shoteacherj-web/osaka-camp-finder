'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CampsiteForm } from '@/components/admin/CampsiteForm'
import type { Campsite } from '@/types'

type FormData = Omit<Campsite, 'id'>

export default function EditCampPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [camp, setCamp] = useState<Campsite | null>(null)

  useEffect(() => {
    fetch('/api/admin/camps')
      .then(r => r.json())
      .then((camps: Campsite[]) => {
        const found = camps.find(c => c.id === id)
        if (!found) router.push('/admin/camps')
        else setCamp(found)
      })
  }, [id])

  async function handleSubmit(data: FormData) {
    const res = await fetch(`/api/admin/camps/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }
    router.push('/admin/camps')
  }

  if (!camp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">読み込み中…</div>
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...initial } = camp

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <Link href="/admin/camps" className="text-green-600 text-sm">← 戻る</Link>
        <h1 className="font-bold text-gray-900 truncate">{camp.name} を編集</h1>
      </div>
      <div className="px-4 py-4">
        <CampsiteForm initial={initial} onSubmit={handleSubmit} submitLabel="更新する" />
      </div>
    </div>
  )
}
