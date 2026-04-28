'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CampsiteForm } from '@/components/admin/CampsiteForm'
import type { Campsite } from '@/types'

type FormData = Omit<Campsite, 'id'>

export default function NewCampPage() {
  const router = useRouter()

  async function handleSubmit(data: FormData) {
    const res = await fetch('/api/admin/camps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }
    router.push('/admin/camps')
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <Link href="/admin/camps" className="text-green-600 text-sm">← 戻る</Link>
        <h1 className="font-bold text-gray-900">新規追加</h1>
      </div>
      <div className="px-4 py-4">
        <CampsiteForm onSubmit={handleSubmit} submitLabel="登録する" />
      </div>
    </div>
  )
}
