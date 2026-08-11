// バッチB（6件）の実写真アップロードスクリプト
// 各キャンプ場の公式サイト／自治体観光サイトから取得した画像を
// Supabase Storage の campsite-images バケットにアップロードし、
// campsites.image_url をカバー画像に更新する。
//
// 使い方: node scripts/upload-batch-b-images.mjs
// （画像は fetch() で取得元URLから直接ダウンロードするため、事前のローカル保存は不要）

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

// ギャラリー機能は /api/campsite-images/[id] がバケット内の "<campsite_id>/" フォルダを
// 一覧取得する仕組みのため、campsites.id と同じ名前のフォルダに配置する。
//
// 各キャンプ場の出典（公式サイト／自治体・観光協会公式サイト）:
//   - 保津川水辺公園オートキャンプ場: https://camp.hozugawakudari.jp/ （施設公式サイト）
//   - 六甲山カンツリーハウス: https://www.rokkosan.com/greenia/ （施設は現在「六甲山アスレチックパークGREENIA」に
//     改称・リニューアルされているが、同一施設・同一運営（六甲山観光株式会社）の公式サイト。BBQ場ページの写真を使用）
//   - 十津川温泉野営場（谷瀬つり橋オートキャンプ場）: https://totsukawa-web.com/tanise-autocamp/ （施設公式サイト）
//   - 南紀白浜オートキャンプ場: https://www.grampus.biz/ （オートキャンプ場グランパス、南紀白浜のオートキャンプ場公式サイト。
//     DB上の旧image_url（cdn.goope.jp）・旧booking_url（shirahama-camp.jp、現在ドメイン失効）と同一施設と判断）
//   - 大阪府民の森 むろいけ園地: https://o-wonderforest.com/ （大阪府民の森公式サイト。DB上のbooking_url
//     osaka-midori.jp/mori/muroike/ はこのドメインにリダイレクトされる）
//
// camp-019（保津峡キャンプ場）は対象外（下記コメント参照）。

const campaigns = [
  {
    id: '406c83d0-e5ef-4bde-96e3-0b03570f1f6c',
    name: '保津川水辺公園オートキャンプ場',
    sourceDomain: 'camp.hozugawakudari.jp',
    images: [
      { url: 'https://camp.hozugawakudari.jp/assets/images/main01.jpg', name: '01-site-tent-tarp.jpg' },
      { url: 'https://camp.hozugawakudari.jp/assets/images/main02.jpg', name: '02-site-tent-closeup.jpg' },
      { url: 'https://camp.hozugawakudari.jp/assets/images/facility01.jpg', name: '03-reception.jpg' },
    ],
    coverMatch: '01-site-tent-tarp',
  },
  {
    id: 'camp-011',
    name: '六甲山カンツリーハウス（六甲山アスレチックパークGREENIA BBQ場）',
    sourceDomain: 'www.rokkosan.com',
    images: [
      { url: 'https://www.rokkosan.com/wp-content/themes/greenia/assets/img/bbq/area01.jpg', name: '01-bbq-pavilion.jpg' },
      { url: 'https://www.rokkosan.com/wp-content/themes/greenia/assets/img/bbq/mainImg01.jpg', name: '02-bbq-scene.jpg' },
      { url: 'https://www.rokkosan.com/wp-content/themes/greenia/assets/img/bbq/area03.jpg', name: '03-bbq-pet-friendly.jpg' },
    ],
    coverMatch: '01-bbq-pavilion',
  },
  {
    id: 'camp-016',
    name: '十津川温泉野営場（谷瀬つり橋オートキャンプ場）',
    sourceDomain: 'totsukawa-web.com',
    images: [
      { url: 'https://totsukawa-web.com/tanise-autocamp/wp-content/uploads/2016/07/tent-1.jpg', name: '01-site-overview.jpg' },
      { url: 'https://totsukawa-web.com/tanise-autocamp/wp-content/uploads/2016/07/rope-1.jpg', name: '02-tent-family.jpg' },
      { url: 'https://totsukawa-web.com/tanise-autocamp/wp-content/uploads/2016/07/river.jpg', name: '03-river.jpg' },
      { url: 'https://totsukawa-web.com/tanise-autocamp/wp-content/uploads/2016/07/momiji-2_644.jpg', name: '04-bungalow-bridge.jpg' },
    ],
    coverMatch: '01-site-overview',
  },
  {
    id: 'camp-010',
    name: '南紀白浜オートキャンプ場（オートキャンプ場グランパス）',
    sourceDomain: 'www.grampus.biz',
    images: [
      { url: 'https://www.grampus.biz/common/img/top/main01b.jpg', name: '01-site-tents.jpg' },
      { url: 'https://www.grampus.biz/common/img/top/map/img08.jpg', name: '02-site-campervans.jpg' },
      { url: 'https://www.grampus.biz/common/img/top/main01a.jpg', name: '03-onsen.jpg' },
      { url: 'https://www.grampus.biz/common/img/top/map/img01.jpg', name: '04-onsen-detail.jpg' },
    ],
    coverMatch: '01-site-tents',
  },
  {
    id: 'camp-001',
    name: '大阪府民の森 むろいけ園地',
    sourceDomain: 'o-wonderforest.com',
    images: [
      { url: 'https://o-wonderforest.com/media/001/202203/megamenu_muroike_img01.jpg', name: '01-muroike-pond.jpg' },
      { url: 'https://o-wonderforest.com/media/001/202203/forests_park_muroike02.jpg', name: '02-boardwalk-marsh.jpg' },
      { url: 'https://o-wonderforest.com/media/001/202203/forests_park_muroike04.jpg', name: '03-entrance-gate.jpg' },
      { url: 'https://o-wonderforest.com/media/001/202203/forests_park_muroike05.jpg', name: '04-pond-wide.jpg' },
    ],
    coverMatch: '01-muroike-pond',
  },
]

// --- camp-019（保津峡キャンプ場）はスキップ ---
// 理由: booking_url (https://hozukyo-camp.jp/) は既にドメイン失効（DNS解決不可）で公式サイトが消滅している。
// Web検索・関連観光サイトを複数調べたが「保津峡キャンプ場」という独立した施設は見つからず、
// 同一住所（京都府亀岡市保津町）で見つかる唯一の施設は本バッチの406c83d0（保津川水辺公園オートキャンプ場）
// と同一のものと考えられる。誤って別施設であるかのように写真を流用すると誤情報になるため、
// 著作権上安全に断定できる出典が無い状態と判断し、画像取得・image_url更新を見送った。

const results = []

for (const camp of campaigns) {
  console.log(`\n=== ${camp.name} (${camp.id}) ===`)
  const urls = []

  for (const img of camp.images) {
    try {
      const res = await fetch(img.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!res.ok) {
        console.error(`  取得失敗: ${img.name} — HTTP ${res.status}`)
        continue
      }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.startsWith('image/')) {
        console.error(`  スキップ（画像ではない）: ${img.name} — content-type=${contentType}`)
        continue
      }
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 3000) {
        console.error(`  スキップ（サイズが小さすぎる、エラーページの可能性）: ${img.name} — ${buf.length} bytes`)
        continue
      }

      const path = `${camp.id}/${img.name}`
      const { error } = await supabase.storage
        .from('campsite-images')
        .upload(path, buf, { contentType: contentType.split(';')[0], upsert: true })

      if (error) {
        console.error(`  アップロード失敗: ${img.name} — ${error.message}`)
        continue
      }

      const { data } = supabase.storage.from('campsite-images').getPublicUrl(path)
      urls.push({ name: img.name, url: data.publicUrl })
      console.log(`  OK: ${img.name} (${buf.length} bytes) -> ${data.publicUrl}`)
    } catch (e) {
      console.error(`  例外: ${img.name} — ${e.message}`)
    }
  }

  if (urls.length === 0) {
    console.log(`  画像を1枚も確保できなかったためスキップします。`)
    results.push({ id: camp.id, name: camp.name, count: 0, cover: null, domain: camp.sourceDomain })
    continue
  }

  const cover = urls.find(u => u.name.includes(camp.coverMatch)) ?? urls[0]
  const { error: updateError } = await supabase
    .from('campsites')
    .update({ image_url: cover.url })
    .eq('id', camp.id)

  if (updateError) {
    console.error(`  カバー画像設定失敗: ${updateError.message}`)
  } else {
    console.log(`  カバー画像設定完了: ${cover.url}`)
  }

  results.push({ id: camp.id, name: camp.name, count: urls.length, cover: cover.url, domain: camp.sourceDomain })
}

console.log('\n\n=== サマリー ===')
for (const r of results) {
  console.log(`${r.name} (${r.id}): ${r.count}枚 / 出典=${r.domain} / カバー=${r.cover ?? 'なし'}`)
}
console.log('\ncamp-019（保津峡キャンプ場）: スキップ（理由はスクリプト内コメント参照）')
