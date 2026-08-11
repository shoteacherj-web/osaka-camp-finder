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

// 各キャンプ場の実際の写真URL
// 公式サイト・観光サイトから取得したもの（14件）+ Unsplash適切写真（6件）
const imageUpdates = [
  // 大阪府民の森 むろいけ園地: 池と森のUnsplash写真に変更
  { id: 'camp-001', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
  // 能勢の郷オートキャンプ場: 里山のUnsplash写真に変更
  { id: 'camp-002', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  // るり渓温泉 for REST CAMP: 公式サイトのメインビジュアル
  { id: 'camp-003', image_url: 'https://rurikei.jp/wp-content/themes/rurrikei2025/assets/images/top/top-fv_1.webp?20250627' },
  // 美山かやぶきキャンプ場: 現状維持（日本の農村風景）
  { id: 'camp-004', image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80' },
  // マキノ高原キャンプ場: 公式サイトの写真
  { id: 'camp-005', image_url: 'https://makinokougen.co.jp/files/libs/11107/pw/202308270834077159.jpg' },
  // 朽木いきものふれあいの里（グリーンパーク想い出の森）: 公式サイト写真
  { id: 'camp-006', image_url: 'https://gp-kutsuki.com/wp-content/uploads/2020/09/top4-1024x486.png' },
  // 曽爾高原キャンプ場: 公式サイトのスライダー写真
  { id: 'camp-007', image_url: 'https://www.soni-kogen.com/common/img/page/img_camp_slider_a01.jpg' },
  // 天川村キャンプ場（あまのかわキャンプ場）: 公式サイト写真
  { id: 'camp-008', image_url: 'https://amanokawa-camp.com/wp-content/themes/amanokawa_camp/img/home--top-img-01.jpg' },
  // 川湯野営場: 熊野本宮観光協会の写真
  { id: 'camp-009', image_url: 'https://www.hongu.jp/wp-content/uploads/2020/01/stay_camp_kawayu_420x270.jpg' },
  // 南紀白浜オートキャンプ場: Plageforet写真
  { id: 'camp-010', image_url: 'https://cdn.goope.jp/203890/230808105920-64d1a17804621_l.jpg' },
  // 六甲山カンツリーハウス: 楽天トラベルの施設写真
  { id: 'camp-011', image_url: 'https://img.travel.rakuten.co.jp/kanko/thumb/28001382_3896_3.jpg' },
  // 神鍋高原キャンプ場: 豊岡市観光サイトの写真
  { id: 'camp-012', image_url: 'https://toyooka-tourism.com/wp-content/uploads/2023/04/kannabekogencamp01.jpg' },
  // 淡路島オートキャンプ場（淡路島西海岸）: 公式サイトのメインビジュアル
  { id: 'camp-013', image_url: 'https://awajishimacamp.com/wp-content/themes/awc/images/mv01-l.jpg' },
  // ウッディパル余呉: キャンプ場レビューサイトの写真
  { id: 'camp-014', image_url: 'https://campismfield.jp/wp-content/uploads/2023/07/%E3%82%A6%E3%83%83%E3%83%87%E3%82%A3%E3%83%91%E3%83%AB%E4%BD%99%E5%91%88-top.jpg' },
  // 五月山キャンプ場: 池田市観光協会の写真
  { id: 'camp-015', image_url: 'https://www.ikedashi-kanko.jp/wp-content/uploads/satukiyama_koen.jpg' },
  // 十津川温泉野営場（谷瀬つり橋オートキャンプ場）: 公式サイト写真
  { id: 'camp-016', image_url: 'https://totsukawa-web.com/tanise-autocamp/wp-content/uploads/2016/07/momiji_644.jpg' },
  // 高野山キャンプ場: 深い杉林のUnsplash写真に変更
  { id: 'camp-017', image_url: 'https://images.unsplash.com/photo-1542382257-80dedb725088?w=800&q=80' },
  // みなべオートキャンプ場: 梅・春のUnsplash写真に変更
  { id: 'camp-018', image_url: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=800&q=80' },
  // 保津峡キャンプ場: 渓谷・川のUnsplash写真に変更
  { id: 'camp-019', image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80' },
  // 武庫川渓谷キャンプ場: 渓谷・川沿いのUnsplash写真に変更
  { id: 'camp-020', image_url: 'https://images.unsplash.com/photo-1501439732498-55e4000bab2d?w=800&q=80' },
]

let updated = 0
let failed = 0

for (const { id, image_url } of imageUpdates) {
  const { error } = await supabase
    .from('campsites')
    .update({ image_url })
    .eq('id', id)

  if (error) {
    console.error(`❌ ${id}: ${error.message}`)
    failed++
  } else {
    console.log(`✅ ${id}: 更新完了`)
    updated++
  }
}

console.log(`\n完了: ${updated}件更新、${failed}件失敗`)
