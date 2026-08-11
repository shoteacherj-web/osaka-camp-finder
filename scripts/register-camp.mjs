// キャンプ場登録スクリプト
// 使い方: node scripts/register-camp.mjs
// campData を書き換えてから実行する

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8')
const env = Object.fromEntries(
  envFile
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

// ===== ここを編集してください =====
const campData = {
  name: '箕面 B-CAMP & sauna',
  area: '大阪',
  address: '大阪府箕面市新稲2丁目14',
  price_min: 3000,
  price_max: 7000,
  amenities: ['toilet', 'power', 'shower', 'water', 'pet', 'firewood', 'cooking'],
  booking_url: 'https://www.nap-camp.com/osaka/16599',
  image_url: 'https://zoideplawhbkwsytrwcg.supabase.co/storage/v1/object/public/campsite-images/db7f855b-4c56-4f3a-879a-dfc68cab24c3/bcamp-08-view-aerial.jpg',
  description: '大阪市内から車で約20分、箕面の森にあるテントサウナ付きキャンプ場。サイトは大きく2段構成で、下段は駐車場から少し歩いてアクセスするデッキサイト（荷物運搬用のキャリーカート貸出あり）、上段はさらに高台にあり車横付け可能なオートサイト（大阪市街を一望できる眺望のよさが際立つ、料金はデッキサイトより高め）。デッキサイト・オートサイトともに開けていて日当たりが良く、夏は日除け対策があると安心。デッキサイトのエリアはペット可・不可の区画が分かれているほか、ボール・プール・トランポリンなど子供向け遊具の貸し出しや遊びスペースもあり、子連れキャンプにもおすすめ。\n\nテントサウナ＆ととのいスペースは宿泊用デッキサイトとは別の専用デッキに設置されており、木々に囲まれ夏でも涼しく利用できる。外気浴用チェアも整備。1張あたり詰めて6名程度、施設全体では大小2張で最大12名まで利用可能（サウナ付きプランの選択が必要）。水シャワー付きのほか温水シャワー（要予約）・トイレも近くにあり、受付付近には貴重品用ロッカーも設置。現地決済はクレジットカード・QRコード決済・交通系ICなどキャッシュレスのみ対応。\n\n※料金はサイトタイプ・プランにより異なる（デッキサイト日帰り3,000円〜、電源付きオートサイト宿泊7,000円〜など、いずれも1区画あたりの目安）。詳細・最新料金は予約サイトでご確認ください。\n\n【定休日】月曜〜木曜（大型連休・年末年始・春夏冬休み期間・祝日・特別日を除く）',
  pros: ['高台のオートサイトから大阪市街・夜景を一望できる抜群の眺望', 'テントサウナ＆ととのいスペースは宿泊デッキサイトとは別の専用デッキで、木々に囲まれ夏でも涼しい', 'ペット可・不可の区画が分かれていて配慮されている', 'ボール・プール・トランポリンなど子供向け遊具の貸出があり子連れにもおすすめ', '荷物運搬用のキャリーカート貸出があり、駐車場からデッキサイトへの移動も安心', '大阪市内から車で約20分とアクセスが良い'],
  cons: ['月〜木曜定休のため利用できる曜日が限られる（繁忙期を除く）', 'デッキサイト・オートサイトともに木陰が少なく、夏は日除け対策があると安心', 'デッキサイトは砂利混じりの地面でペグが刺さりにくい箇所もある', 'テントサウナは斜面近くに設置されており虫が気になることがある', '現地決済はキャッシュレスのみ対応'],
}
// ==================================

// 国土地理院(GSI)の住所検索APIで取得した座標
const manualCoordinates = { lat: 34.834339, lng: 135.458923 }

async function getCoordinates(address) {
  if (manualCoordinates) return manualCoordinates
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.results?.[0]?.geometry?.location) return data.results[0].geometry.location
  throw new Error(`座標取得失敗: ${data.status} — ${address}`)
}

const { lat, lng } = await getCoordinates(campData.address)
console.log(`座標取得: lat=${lat}, lng=${lng}`)

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const { data, error } = await supabase
  .from('campsites')
  .insert({ id: randomUUID(), ...campData, lat, lng })
  .select()
  .single()

if (error) {
  console.error('登録失敗:', error.message)
  process.exit(1)
}

console.log('登録完了！')
console.log('ID:', data.id)
console.log('名前:', data.name)
console.log('エリア:', data.area)
console.log('座標:', data.lat, data.lng)
