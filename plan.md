# Osaka Camp Finder — 進捗まとめ

## ステータス：Phase 2 実装中（2026-04-30）

**URL:** https://osaka-camp-finder.vercel.app/

---

## 完了済み

### Phase 1（2026-04-26）
- [x] プロジェクト初期セットアップ（Next.js 16 + TypeScript + Tailwind + Jest）
- [x] 型定義（`types/index.ts`）
- [x] キャンプ場データ 20件（`data/camps.json` → Supabase に移行済み）
- [x] Supabase クライアント + 匿名認証（`lib/supabase.ts`）
- [x] 天気取得クライアント（`lib/weather.ts`）
- [x] Zustand ストア：比較・お気に入り（`stores/`）
- [x] フック：useCamps / useCamp / useWeather / useVisitLogs（`hooks/`）
- [x] コンポーネント：CampCard / FilterPanel / WeatherWidget / CampMap / VisitLogForm / VisitLogCard
- [x] ページ：一覧・詳細・訪問記録一覧・訪問記録追加
- [x] レイアウト：AuthProvider / BottomNav / PWA manifest
- [x] Vercel Cron（毎日0時に天気データ自動更新）
- [x] 33テスト全通過・ビルド成功

### Phase 2（2026-04-27〜30）
- [x] UI/UX 全面改修（BottomSheet / CampCard 縦型 / FilterPanel 改修）
- [x] 比較画面（`/compare`）— compareStore + 比較テーブル表示
- [x] BottomNav 改修（「探す」削除・比較バッジ追加・戻るボタン追加）
- [x] Supabase campsites テーブル作成・20件データ投入
- [x] 全ページを Supabase から取得に統一（camps.json 廃止）
- [x] 管理画面（`/admin`）実装
  - [x] パスワード認証（httpOnly クッキー）
  - [x] キャンプ場 CRUD（一覧・新規追加・編集・削除）
  - [x] 住所→座標自動取得（Google Geocoding API）
  - [x] service_role キーによるサーバーサイド書き込み

### インフラ・設定
- [x] Supabase テーブル作成（campsites / visit_logs / weather_cache）
- [x] RLS 設定（campsites: anon は SELECT のみ、書き込みは service_role のみ）
- [x] GitHub push（shoteacherj-web/osaka-camp-finder）
- [x] Vercel デプロイ（自動デプロイ設定済み）
- [x] Google Maps API キー設定（osaka-camp-finder.vercel.app 許可済み）

---

## 残課題

- [ ] Vercel に `ADMIN_PASSWORD` 環境変数を追加してリデプロイ（本番管理画面を有効化）
- [ ] Google Maps API の localhost:3001 を許可リストに追加（ローカル開発用）
- [ ] 口コミ表示（reviews テーブルは作成済み）
- [ ] 一覧マップ表示（全ピン + ポップアップ）
- [ ] 写真アップロード（Supabase Storage）
- [ ] お気に入りリスト画面

---

## 環境変数

| 変数名 | 用途 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー（読み取り） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 管理キー（管理画面・Cron） |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps / Geocoding API |
| `OPENWEATHERMAP_API_KEY` | 天気 API |
| `CRON_SECRET` | Cron 認証トークン |
| `ADMIN_PASSWORD` | 管理画面パスワード（ローカル: `osaka-admin-2024`） |

---

## 管理画面

| 項目 | 内容 |
|------|------|
| ローカル URL | http://localhost:3001/admin |
| 本番 URL | https://osaka-camp-finder.vercel.app/admin |
| パスワード | ADMIN_PASSWORD 環境変数の値 |
| 認証方式 | httpOnly クッキー（7日間有効） |
| データ書き込み | Next.js API ルート経由 → service_role キーで Supabase 操作 |
