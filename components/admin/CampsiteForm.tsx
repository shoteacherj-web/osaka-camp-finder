'use client'
import { useState } from 'react'
import type { Campsite, Amenity, Area } from '@/types'

const AREAS: Area[] = ['大阪', '兵庫', '京都', '奈良', '和歌山', '滋賀']
const AMENITY_OPTIONS: { key: Amenity; label: string }[] = [
  { key: 'toilet', label: 'トイレ' },
  { key: 'shower', label: 'シャワー' },
  { key: 'power', label: '電源' },
  { key: 'pet', label: 'ペット可' },
]

type FormData = Omit<Campsite, 'id'>

interface Props {
  initial?: FormData
  onSubmit: (data: FormData) => Promise<void>
  submitLabel: string
}

const EMPTY: FormData = {
  name: '', area: AREAS[0], address: '', lat: 0, lng: 0,
  price_min: 0, price_max: undefined, amenities: [],
  booking_url: '', image_url: '', description: '', pros: [], cons: [],
}

export function CampsiteForm({ initial = EMPTY, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<FormData>(initial)
  const [prosInput, setProsInput] = useState(initial.pros.join('\n'))
  const [consInput, setConsInput] = useState(initial.cons.join('\n'))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleAmenity(key: Amenity) {
    set('amenities', form.amenities.includes(key)
      ? form.amenities.filter(a => a !== key)
      : [...form.amenities, key])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onSubmit({
        ...form,
        pros: prosInput.split('\n').map(s => s.trim()).filter(Boolean),
        cons: consInput.split('\n').map(s => s.trim()).filter(Boolean),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500'

  function field(label: string, children: React.ReactNode) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        {children}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-8">
      {field('キャンプ場名 *', (
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          className={inputClass} required />
      ))}
      {field('エリア *', (
        <select value={form.area} onChange={e => set('area', e.target.value as Area)} className={inputClass}>
          {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      ))}
      {field('住所 *', (
        <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
          className={inputClass} required />
      ))}
      <div className="grid grid-cols-2 gap-3">
        {field('緯度 *', (
          <input type="number" value={form.lat} onChange={e => set('lat', Number(e.target.value))}
            className={inputClass} required step="any" />
        ))}
        {field('経度 *', (
          <input type="number" value={form.lng} onChange={e => set('lng', Number(e.target.value))}
            className={inputClass} required step="any" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('料金（最安）*', (
          <input type="number" value={form.price_min} onChange={e => set('price_min', Number(e.target.value))}
            className={inputClass} required min={0} />
        ))}
        {field('料金（最高）', (
          <input type="number" value={form.price_max ?? ''}
            onChange={e => set('price_max', e.target.value === '' ? undefined : Number(e.target.value))}
            className={inputClass} min={0} />
        ))}
      </div>
      {field('設備', (
        <div className="flex gap-3 flex-wrap">
          {AMENITY_OPTIONS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={form.amenities.includes(key)} onChange={() => toggleAmenity(key)}
                className="rounded text-green-600" />
              {label}
            </label>
          ))}
        </div>
      ))}
      {field('予約 URL *', (
        <input type="url" value={form.booking_url} onChange={e => set('booking_url', e.target.value)}
          className={inputClass} required />
      ))}
      {field('画像 URL', (
        <input type="url" value={form.image_url} onChange={e => set('image_url', e.target.value)}
          className={inputClass} />
      ))}
      {field('説明', (
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          rows={3} className={inputClass} />
      ))}
      {field('良いところ（1行1件）', (
        <textarea value={prosInput} onChange={e => setProsInput(e.target.value)}
          rows={3} placeholder="例：景色が良い" className={inputClass} />
      ))}
      {field('イマイチ（1行1件）', (
        <textarea value={consInput} onChange={e => setConsInput(e.target.value)}
          rows={3} placeholder="例：トイレが遠い" className={inputClass} />
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50">
        {loading ? '保存中…' : submitLabel}
      </button>
    </form>
  )
}
