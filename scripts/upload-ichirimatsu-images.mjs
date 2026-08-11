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
const CAMPSITE_ID = '39c72721-d20b-4ae2-9a74-f4cafd6f82ec'

const files = [
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\353366de-1000005297.jpg', name: 'ichirimatsu-01-terrace.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\ece62c24-1000005298.jpg', name: 'ichirimatsu-02-sign.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\c4886d16-1000005299.jpg', name: 'ichirimatsu-03-sign2.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\d63dd780-1000005300.jpg', name: 'ichirimatsu-04-entrance.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\8937938b-1000005301.jpg', name: 'ichirimatsu-05-river.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\f8ec0c42-1000005302.jpg', name: 'ichirimatsu-06-river2.jpg' },
  { local: 'C:\\Users\\jo-sh\\.claude\\uploads\\86be1b9c-257c-47df-96ab-7cfc3f1eedce\\31c99b6b-1000005303.jpg', name: 'ichirimatsu-07-terrace2.jpg' },
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

console.log('\n--- 全URL ---')
console.log(JSON.stringify(urls, null, 2))
