// バッチC: 5キャンプ場の実写画像をSupabase Storageにアップロードし、ギャラリー化した作業の記録スクリプト。
// camp-008 天川村キャンプ場 / camp-009 川湯野営場 / camp-007 曽爾高原キャンプ場 /
// camp-006 朽木いきものふれあいの里 / camp-020 武庫川渓谷キャンプ場（→ 出典が見つからずスキップ）
//
// 実行時の流れ（後から見返す用。実行するには DOWNLOADS の各URLをローカルに保存してから
// node scripts/upload-batch-c-images.mjs を実行する）:
//   1. 各キャンプ場の公式サイト/自治体観光協会サイトをWeb検索で特定
//   2. curl -sL <URL> でHTML取得 → grep で .jpg/.jpeg/.png/.webp を抽出
//   3. ロゴ・アイコン等を除外し、風景・施設が写っている画像を厳選してダウンロード
//   4. Supabase Storage の campsite-images/<campsite_id>/ にアップロード
//   5. 一番見栄えの良い画像を campsites.image_url に設定
//
// ギャラリー機能は /api/campsite-images/[id] がバケット内の "<campsite_id>/" フォルダを
// 一覧取得する仕組みのため、campsites.id と同じ名前のフォルダに配置している。

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

// 各キャンプ場: 取得元URL（公式サイト/観光協会サイト）と、アップロードしたファイル名の対応。
// download: フェッチ元の元画像URL（このスクリプト単体で再実行する場合はここから再取得できる）
// remote:   Storage上のファイル名（<campsite_id>/<remote>）
const CAMPS = [
  {
    id: 'camp-008',
    name: '天川村キャンプ場',
    source: 'https://amanokawa-camp.com/（公式サイト）',
    files: [
      { download: 'https://amanokawa-camp.com/wp-content/themes/amanokawa_camp/img/home--top-img-02.jpg', remote: '01-river-autumn.jpg' },
      { download: 'https://amanokawa-camp.com/wp-content/themes/amanokawa_camp/img/home--top-img-01.jpg', remote: '02-river-bridge.jpg' },
      { download: 'https://amanokawa-camp.com/wp-content/themes/amanokawa_camp/img/home--top-img-03.jpg', remote: '03-riverbed.jpg' },
      { download: 'https://amanokawa-camp.com/wp-content/themes/amanokawa_camp/img/guide--img-09.jpg', remote: '04-firepit-shelter.jpg' },
    ],
    cover: '01-river-autumn.jpg',
  },
  {
    id: 'camp-009',
    name: '川湯野営場',
    source: 'https://tanabe-kawayu-camp.com/（田辺市・川湯野営場公式サイト）',
    files: [
      { download: 'https://tanabe-kawayu-camp.com/wp-content/uploads/2022/05/home_main_27.jpg', remote: '01-aerial-view.jpg' },
      { download: 'https://tanabe-kawayu-camp.com/wp-content/uploads/2022/05/home_main_28.jpg', remote: '02-riverside-camp.jpg' },
      { download: 'https://tanabe-kawayu-camp.com/wp-content/uploads/2021/04/top-facility-b.jpg', remote: '03-rest-shelter.jpg' },
      { download: 'https://tanabe-kawayu-camp.com/wp-content/uploads/2021/03/top-usage-guide.jpg', remote: '04-reception-sakura.jpg' },
    ],
    cover: '01-aerial-view.jpg',
  },
  {
    id: 'camp-007',
    name: '曽爾高原キャンプ場',
    source: 'https://www.soni-kogen.com/camp/（公式サイト）',
    files: [
      { download: 'https://www.soni-kogen.com/common/img/page/img_camp_slider_f02.jpg', remote: '01-cabins-exterior.jpg' },
      { download: 'https://www.soni-kogen.com/common/img/page/img_camp_slider_f01.jpg', remote: '02-cabins-view.jpg' },
      { download: 'https://www.soni-kogen.com/common/img/page/img_camp_slider_f03.jpg', remote: '03-bungalow-sign.jpg' },
    ],
    cover: '01-cabins-exterior.jpg',
  },
  {
    id: 'camp-006',
    name: '朽木いきものふれあいの里',
    source: 'https://camp-kutsuki.com/（グリーンパーク想い出の森 内・公式キャンプサイト）',
    files: [
      { download: 'https://camp-kutsuki.com/wp-content/uploads/2017/08/kutsukicamp_top2.jpg', remote: '01-campsite-wide.jpg' },
      { download: 'https://camp-kutsuki.com/wp-content/uploads/2017/08/kutsuki08.jpg', remote: '02-wash-facility.jpg' },
      { download: 'https://camp-kutsuki.com/wp-content/uploads/2017/08/kutsuki09.jpg', remote: '03-night-tent.jpg' },
      { download: 'https://camp-kutsuki.com/wp-content/uploads/2017/08/kutsuki01.jpg', remote: '04-site-table.jpg' },
    ],
    cover: '01-campsite-wide.jpg',
  },
  {
    id: 'camp-020',
    name: '武庫川渓谷キャンプ場',
    source: null,
    files: [],
    cover: null,
    skipReason:
      'DB上のbooking_url (https://mukogawa-camp.jp/) がDNS解決不能（ドメイン消滅）。' +
      'Web検索・Wayback Machine(CDX API)でも公式サイト/観光協会サイトが一切見つからず、' +
      '出典不明な画像を使うことになるためアップロードを見送り。image_urlはUnsplashのままとした。',
  },
]

async function fetchAsBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.startsWith('image/')) throw new Error(`not an image (content-type: ${contentType})`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  for (const camp of CAMPS) {
    console.log(`\n=== ${camp.name} (${camp.id}) ===`)
    if (camp.files.length === 0) {
      console.log(`スキップ: ${camp.skipReason}`)
      continue
    }
    const urls = {}
    for (const { download, remote } of camp.files) {
      let buf
      try {
        buf = await fetchAsBuffer(download)
      } catch (e) {
        console.error(`取得失敗: ${remote} (${download}) — ${e.message}`)
        continue
      }
      const storagePath = `${camp.id}/${remote}`
      const { error } = await supabase.storage
        .from('campsite-images')
        .upload(storagePath, buf, { contentType: 'image/jpeg', upsert: true })
      if (error) {
        console.error(`アップロード失敗: ${remote} — ${error.message}`)
        continue
      }
      const { data } = supabase.storage.from('campsite-images').getPublicUrl(storagePath)
      urls[remote] = data.publicUrl
      console.log(`OK: ${remote} -> ${data.publicUrl}`)
    }

    if (camp.cover && urls[camp.cover]) {
      const { error } = await supabase.from('campsites').update({ image_url: urls[camp.cover] }).eq('id', camp.id)
      console.log(error ? `カバー設定失敗: ${error.message}` : `カバー設定完了: ${urls[camp.cover]}`)
    }
  }
}

main()
