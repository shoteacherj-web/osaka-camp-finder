import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

// ギャラリー機能は /api/campsite-images/[id] がバケット内の "<campsite_id>/" フォルダを一覧取得する仕組みのため、
// campsites.id と同じ名前のフォルダに配置する
const CAMPSITE_ID = 'db7f855b-4c56-4f3a-879a-dfc68cab24c3'

const base = 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\'

const files = [
  { local: base + 'ba466a2f-1000005229.jpg', name: 'bcamp-01-reception.jpg' },
  { local: base + '7594b97a-1000005228.jpg', name: 'bcamp-02-entrance.jpg' },
  { local: base + 'a7b581e6-1000005226.jpg', name: 'bcamp-03-deck-pet.jpg' },
  { local: base + 'f96c022c-1000005230.jpg', name: 'bcamp-04-sauna.jpg' },
  { local: base + '7f9cd38d-1000005231.jpg', name: 'bcamp-05-totonoi-chairs.jpg' },
  { local: base + 'a22a36cc-1000005234.jpg', name: 'bcamp-06-sauna-guide.jpg' },
  { local: base + 'cc88c9eb-1000005233.jpg', name: 'bcamp-07-sauna2.jpg' },
  { local: base + 'bec6ebc2-1000005237.jpg', name: 'bcamp-08-view-aerial.jpg' },
  { local: base + '05d3d3c6-1000005236.jpg', name: 'bcamp-09-view-site.jpg' },
  { local: base + '8b15611a-1000005235.jpg', name: 'bcamp-10-reception-area.jpg' },
  { local: base + 'f01d377f-1000005238.jpg', name: 'bcamp-11-deck-sites.jpg' },
  { local: base + '90a9ec8a-1000005239.jpg', name: 'bcamp-12-site-g.jpg' },
  { local: base + 'cdd28d0c-1000005240.jpg', name: 'bcamp-13-site.jpg' },
  { local: base + '7fbbb159-1000005241.jpg', name: 'bcamp-14-auto-site.jpg' },
  { local: base + '9ee05254-1000005242.jpg', name: 'bcamp-15-kitchen-vending.jpg' },
]

const urls = []

for (const { local, name } of files) {
  const buf = readFileSync(local)
  const path = `${CAMPSITE_ID}/${name}`
  const { error } = await supabase.storage
    .from('campsite-images')
    .upload(path, buf, { contentType: 'image/jpeg', upsert: true })

  if (error) {
    console.error(`失敗: ${name} — ${error.message}`)
    continue
  }

  const { data } = supabase.storage.from('campsite-images').getPublicUrl(path)
  urls.push(data.publicUrl)
  console.log(`OK: ${name} -> ${data.publicUrl}`)
}

console.log('\n--- カバー画像に設定 ---')
const cover = urls.find(u => u.includes('bcamp-08-view-aerial'))
if (cover) {
  const { error } = await supabase.from('campsites').update({ image_url: cover }).eq('id', CAMPSITE_ID)
  console.log(error ? `失敗: ${error.message}` : `設定完了: ${cover}`)
}
