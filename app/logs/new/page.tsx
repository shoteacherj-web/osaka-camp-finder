'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import campsData from '@/data/camps.json'
import { useVisitLogs } from '@/hooks/useVisitLogs'
import { VisitLogForm } from '@/components/VisitLogForm'
import type { Campsite, VisitLog } from '@/types'

function NewLogForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCampsiteId = searchParams.get('campsite') ?? undefined
  const { addLog } = useVisitLogs()
  const camps = campsData as Campsite[]

  async function handleSubmit(data: Omit<VisitLog, 'id' | 'user_id' | 'created_at'>) {
    const { error } = await addLog(data)
    if (!error) {
      router.push('/logs')
    } else {
      alert('保存に失敗しました。もう一度お試しください。')
    }
  }

  return (
    <VisitLogForm
      camps={camps}
      defaultCampsiteId={defaultCampsiteId}
      onSubmit={handleSubmit}
    />
  )
}

export default function NewLogPage() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <Link href="/logs" className="text-green-600 text-sm">← 記録一覧へ</Link>
        <h1 className="font-bold text-gray-900 mt-0.5">訪問記録を追加</h1>
      </div>
      <div className="px-4 py-4">
        <Suspense>
          <NewLogForm />
        </Suspense>
      </div>
    </div>
  )
}
