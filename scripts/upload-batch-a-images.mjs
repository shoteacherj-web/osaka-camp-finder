// バッチA（6件）の画像差し替えスクリプト
// 各キャンプ場の公式サイト／自治体・観光協会公式サイトから実写真を取得し、
// Supabase Storage の campsite-images/<campsite_id>/ に配置、image_url を更新する。
//
// 使い方: node scripts/upload-batch-a-images.mjs
//
// 出典が確認できなかった（公式サイトが存在しない、または公的機関の掲載がない）
// キャンプ場はスキップしている（下記コメント参照）。
//   - HOMURA FIELD 高山 キャンプ場 ホムラフィールド高山 (bccd2836-7d28-4818-8685-c4bf4aeceade)
//     豊能町公式サイト・豊能町観光協会公式サイトのいずれにも掲載なし。
//     見つかったのは Instagram/Facebook（SNS投稿）となっぷ等の予約サイトのみのためスキップ。
//   - みなべオートキャンプ場 / 梅の里オートキャンプ場 (camp-018)
//     和歌山みなべ観光協会公式サイト・みなべ町公式サイトのいずれにも掲載なし。
//     見つかったのは個人ブログ・予約サイト（なっぷ等）のみのためスキップ。

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

function contentTypeFor(name) {
  if (name.endsWith('.webp')) return 'image/webp'
  if (name.endsWith('.png')) return 'image/png'
  return 'image/jpeg'
}

const sites = [
  {
    campsiteId: 'camp-014',
    name: 'ウッディパル余呉',
    sourceDomain: 'woodypal.jp（公式サイト）',
    coverFile: '01-forest-tent-site.jpg',
    files: [
      { url: 'https://woodypal.jp/wp-content/themes/web/img/camp/hero.jpg', name: '01-forest-tent-site.jpg' },
      { url: 'https://woodypal.jp/wp-content/themes/web/img/camp/free-site.jpg', name: '02-aerial-free-site.jpg' },
      { url: 'https://woodypal.jp/wp-content/themes/web/img/camp/jukan-site.jpg', name: '03-jukan-site-road.jpg' },
    ],
  },
  {
    campsiteId: 'camp-005',
    name: 'マキノ高原キャンプ場',
    sourceDomain: 'makinokougen.co.jp（公式サイト）',
    coverFile: '01-aerial-day-campsite.jpg',
    files: [
      { url: 'https://makinokougen.co.jp/files/libs/11242/pw/202504081553407560.jpg', name: '01-aerial-day-campsite.jpg' },
      { url: 'https://makinokougen.co.jp/files/libs/11241/pw/20250408155314390.jpg', name: '02-aerial-night-campsite.jpg' },
      { url: 'https://makinokougen.co.jp/files/libs/12430/pw/202608061217429363.jpg', name: '03-forest-hideaway-site.jpg' },
    ],
  },
  {
    campsiteId: 'camp-003',
    name: 'るり渓温泉 for REST CAMP',
    sourceDomain: 'rurikei.jp（公式サイト）',
    coverFile: '01-villa-cottages-dusk.webp',
    files: [
      { url: 'https://rurikei.jp/wp-content/themes/rurrikei2025/assets/images/stay/asobiyuku-villa/asobiyuku-villa-fv_2.webp', name: '01-villa-cottages-dusk.webp' },
      { url: 'https://rurikei.jp/wp-content/themes/rurrikei2025/assets/images/top/top-fv_4.webp', name: '02-building-exterior-dusk.webp' },
      { url: 'https://rurikei.jp/wp-content/themes/rurrikei2025/assets/images/top/top-fv_3.webp', name: '03-outdoor-onsen.webp' },
      { url: 'https://rurikei.jp/wp-content/themes/rurrikei2025/assets/images/top/asobiyuku-1.webp', name: '04-lawn-activity.webp' },
    ],
  },
  {
    campsiteId: 'camp-015',
    name: '五月山キャンプ場',
    sourceDomain: 'ikedashi-kanko.jp（池田市観光協会公式サイト）',
    coverFile: '01-viewpoint-bench.jpg',
    files: [
      { url: 'https://www.ikedashi-kanko.jp/wp-content/uploads/satukiyama_koen.jpg', name: '01-viewpoint-bench.jpg' },
      { url: 'https://www.ikedashi-kanko.jp/wp-content/uploads/satsukiyama-2.jpg', name: '02-lawn-stage.jpg' },
    ],
  },
]

const results = []

for (const site of sites) {
  console.log(`\n=== ${site.name} (${site.campsiteId}) ===`)
  const urls = []

  for (const { url, name } of site.files) {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`  取得失敗: ${name} (HTTP ${res.status})`)
      continue
    }
    const ct = res.headers.get('content-type') || ''
    const buf = Buffer.from(await res.arrayBuffer())

    // HTMLエラーページ等の簡易チェック
    if (ct.includes('text/html') || buf.length < 2000) {
      console.error(`  スキップ（不正なレスポンス）: ${name} content-type=${ct} size=${buf.length}`)
      continue
    }

    const path = `${site.campsiteId}/${name}`
    const { error } = await supabase.storage
      .from('campsite-images')
      .upload(path, buf, { contentType: contentTypeFor(name), upsert: true })

    if (error) {
      console.error(`  アップロード失敗: ${name} — ${error.message}`)
      continue
    }

    const { data } = supabase.storage.from('campsite-images').getPublicUrl(path)
    urls.push({ name, publicUrl: data.publicUrl })
    console.log(`  OK: ${name} -> ${data.publicUrl}`)
  }

  let coverUrl = null
  const cover = urls.find(u => u.name === site.coverFile)
  if (cover) {
    coverUrl = cover.publicUrl
    const { error } = await supabase.from('campsites').update({ image_url: coverUrl }).eq('id', site.campsiteId)
    if (error) {
      console.error(`  カバー画像設定失敗: ${error.message}`)
    } else {
      console.log(`  カバー画像設定完了: ${coverUrl}`)
    }
  } else {
    console.error('  カバー画像候補がアップロードできなかったため image_url は更新していません')
  }

  results.push({
    name: site.name,
    campsiteId: site.campsiteId,
    sourceDomain: site.sourceDomain,
    uploadedCount: urls.length,
    coverUrl,
  })
}

console.log('\n\n=== サマリー ===')
for (const r of results) {
  console.log(`${r.name}: ${r.uploadedCount}枚 / 出典: ${r.sourceDomain} / カバー: ${r.coverUrl ?? '未設定'}`)
}
console.log('\nスキップ: HOMURA FIELD 高山 キャンプ場（公式・公的機関サイトなし）、みなべオートキャンプ場（同左）')
