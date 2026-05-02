export type Area = '大阪' | '兵庫' | '京都' | '奈良' | '和歌山' | '滋賀'
export type Amenity = 'toilet' | 'shower' | 'power' | 'pet'
export type PriceRange = 'budget' | 'mid' | 'premium'

export type Campsite = {
  id: string
  name: string
  area: Area
  address: string
  lat: number
  lng: number
  price_min: number
  price_max?: number
  amenities: Amenity[]
  booking_url: string
  image_url: string
  description: string
  pros: string[]
  cons: string[]
}

export type DayWeather = {
  date: string       // YYYY-MM-DD
  temp_max: number
  temp_min: number
  condition: string  // 'Clear' | 'Rain' | 'Clouds' など
  icon: string       // OpenWeatherMap アイコンコード e.g. '01d'
  pop: number        // 降水確率 0〜1
}

export type WeatherCache = {
  campsite_id: string
  forecast: DayWeather[]
  updated_at: string
}

export type VisitLog = {
  id: string
  user_id: string
  campsite_id: string
  visit_date: string  // YYYY-MM-DD
  rating: number      // 1〜5
  memo: string
  photos: string[]
  created_at: string
}

export type CampsiteFilter = {
  area: Area | null
  price_range: PriceRange | null
  amenities: Amenity[]
  search: string
}

export type Review = {
  id: string
  campsite_id: string
  rating: number        // 1〜5
  comment: string
  visit_date: string    // YYYY-MM-DD
  created_at: string
}
