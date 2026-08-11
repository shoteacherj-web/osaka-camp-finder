// バッチD: 淡路島オートキャンプ場(camp-013) / 神鍋高原キャンプ場(camp-012) /
//          美山かやぶきキャンプ場(camp-004) / 能勢の郷オートキャンプ場(camp-002)
// 各キャンプ場の公式サイト・観光協会公式サイトから実写真を取得し、
// Supabase Storage の campsite-images/<campsite_id>/ に複数枚アップロードしてギャラリー化。
// 最も見栄えの良い1枚を campsites.image_url（カバー画像）に設定する。
//
// 出典:
//  - camp-013: 淡路島オートキャンプ場 公式サイト (https://awajishimacamp.com/)
//  - camp-012: 神鍋高原キャンプ場 | 豊岡市観光公式サイト (https://toyooka-tourism.com/spot/kannabe-camp/)
//  - camp-004: 美山町自然文化村河鹿荘 キャンプ場公式サイト (https://miyama-kajika.com/camp/)
//  - camp-002: 能勢温泉キャンプ場 公式サイト (http://noseonsencamp.jp/)
//      ※旧「能勢の郷オートキャンプ場」（booking_url: nose-nosesato.com）はドメイン消滅済み。
//        能勢温泉が運営する後継施設「新能勢の郷公園キャンプ場」と同一の能勢温泉キャンプ場
//        (noseonsencamp.jp) を公式サイトとして採用。
//
// camp-017 高野山キャンプ場はスキップ（下記メモ参照）。
//
// 実行: node scripts/upload-batch-d-images.mjs

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
const BUCKET = 'campsite-images'

// campsites.id は camp-XXX 形式（Supabase Storage のフォルダ名もこれに合わせる）
const jobs = [
  {
    campsiteId: 'camp-013',
    label: '淡路島オートキャンプ場',
    coverKeyword: '01-mainview',
    images: [
      { url: 'https://awajishimacamp.com/wp-content/themes/awc/images/mv01-l.jpg', name: '01-mainview-oceanfront.jpg' },
      { url: 'https://awajishimacamp.com/wp-content/themes/awc/images/pic-top-activity-large.jpg', name: '02-activity-sup.jpg' },
      { url: 'https://awajishimacamp.com/wp-content/themes/awc/images/pic-top-area-large.jpg', name: '03-area-oceanview.jpg' },
      { url: 'https://awajishimacamp.com/wp-content/themes/awc/images/pic-top-sunset-large.jpg', name: '04-sunset.jpg' },
    ],
  },
  {
    campsiteId: 'camp-012',
    label: '神鍋高原キャンプ場',
    coverKeyword: '01-forest-overview',
    images: [
      { url: 'https://toyooka-tourism.com/wp-content/uploads/2023/04/kannabekogencamp01.jpg', name: '01-forest-overview.jpg' },
      { url: 'https://toyooka-tourism.com/wp-content/uploads/2023/04/kannabekogencamp02.jpg', name: '02-tarp-mountains.jpg' },
      { url: 'https://toyooka-tourism.com/wp-content/uploads/2023/04/kannabekogencamp04.jpg', name: '03-dogrun.jpg' },
      { url: 'https://toyooka-tourism.com/wp-content/uploads/2023/04/kannabekogencamp06.jpg', name: '04-grass-slope-lift.jpg' },
    ],
  },
  {
    campsiteId: 'camp-004',
    label: '美山かやぶきキャンプ場',
    coverKeyword: '01-forest-site',
    images: [
      { url: 'https://miyama-kajika.com/assets/img/camp/min/site_1_1.jpg', name: '01-forest-site.jpg' },
      { url: 'https://miyama-kajika.com/assets/img/camp/min/site_2_1.jpg', name: '02-autumn-site.jpg' },
      { url: 'https://miyama-kajika.com/assets/img/camp/bbq_1.jpg', name: '03-bbq.jpg' },
      { url: 'https://miyama-kajika.com/assets/img/camp/min/site_3_1.jpg', name: '04-solo-forest.jpg' },
    ],
  },
  {
    campsiteId: 'camp-002',
    label: '能勢の郷オートキャンプ場',
    coverKeyword: '01-campsite-road',
    images: [
      { url: 'http://noseonsencamp.jp/wp-content/uploads/2024/07/PS5_2429-scaled.jpg', name: '01-campsite-road.jpg' },
      { url: 'http://noseonsencamp.jp/wp-content/uploads/2024/07/IMG_4320-scaled.jpg', name: '02-forest-platforms.jpg' },
      { url: 'http://noseonsencamp.jp/wp-content/uploads/2024/07/PS5_2168-scaled.jpg', name: '03-campsite-path.jpg' },
      { url: 'http://noseonsencamp.jp/wp-content/uploads/2024/07/Top_mid_slider_%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%97%E5%A0%B44-scaled.jpg', name: '04-bbq.jpg' },
    ],
  },
]

// camp-017 高野山キャンプ場についてのメモ:
// booking_url (koyasan-camp.jp) は既にドメイン失効。現地は「高野山森林公園」（高野町設置・管理）に
// 相当すると推測されるが、専用の公式サイトが存在せず、高野町公式サイトの唯一の関連記事
// (森林公園であそぼう！！ /sangyo/information/7322.html) も現在は404で、Wayback Machine
// のアーカイブ版に残っていた写真2枚は2017年の保育園児遠足の遊具スナップで、園児の顔がはっきり
// 写っており、キャンプ場・ログハウス自体を写したものでもない。公的機関の公式サイトかつ
// キャンプ場を写した適切な写真が確保できなかったため、今回はスキップ（image_url は変更しない）。

let totalUploaded = 0
const results = []

for (const job of jobs) {
  console.log(`\n=== ${job.label} (${job.campsiteId}) ===`)
  const urls = []

  for (const img of job.images) {
    try {
      const res = await fetch(img.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) {
        console.error(`  失敗（HTTP ${res.status}）: ${img.name}`)
        continue
      }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.startsWith('image/')) {
        console.error(`  失敗（Content-Typeが画像ではない: ${contentType}）: ${img.name}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 5000) {
        console.error(`  失敗（サイズが小さすぎる: ${buf.length} bytes）: ${img.name}`)
        continue
      }

      const path = `${job.campsiteId}/${img.name}`
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buf, { contentType: contentType.split(';')[0], upsert: true })

      if (error) {
        console.error(`  アップロード失敗: ${img.name} — ${error.message}`)
        continue
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      urls.push({ name: img.name, publicUrl: data.publicUrl })
      totalUploaded++
      console.log(`  OK: ${img.name}`)
    } catch (e) {
      console.error(`  例外: ${img.name} — ${e.message}`)
    }
  }

  let coverUrl = null
  if (urls.length > 0) {
    const cover = urls.find(u => u.name.includes(job.coverKeyword)) || urls[0]
    const { error } = await supabase.from('campsites').update({ image_url: cover.publicUrl }).eq('id', job.campsiteId)
    if (error) {
      console.error(`  カバー画像設定失敗: ${error.message}`)
    } else {
      coverUrl = cover.publicUrl
      console.log(`  カバー画像設定: ${cover.publicUrl}`)
    }
  } else {
    console.log('  画像を1枚も確保できなかったためスキップ（image_url未変更）')
  }

  results.push({ ...job, uploadedCount: urls.length, coverUrl })
}

console.log('\n\n=== サマリー ===')
for (const r of results) {
  console.log(`${r.label} (${r.campsiteId}): ${r.uploadedCount}枚 / カバー: ${r.coverUrl ?? 'なし'}`)
}
console.log(`\n合計アップロード枚数: ${totalUploaded}`)
console.log('camp-017 高野山キャンプ場: 適切な出典の写真が確保できずスキップ（上記コメント参照）')
