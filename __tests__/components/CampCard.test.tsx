import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CampCard } from '@/components/CampCard'
import type { Campsite } from '@/types'
import { useFavoritesStore } from '@/stores/favoritesStore'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const camp: Campsite = {
  id: 'camp-001',
  name: 'テストキャンプ場',
  area: '大阪',
  address: '大阪府四條畷市',
  lat: 34.7,
  lng: 135.5,
  price_min: 2500,
  amenities: ['toilet', 'shower'],
  booking_url: 'https://example.com',
  image_url: 'https://images.unsplash.com/photo-123?w=800&q=80',
  description: '清流沿いの自然豊かなサイト。',
  pros: ['川遊びが楽しめる'],
  cons: ['電源なし'],
}

const mockCamp: Campsite = {
  id: 'camp-1',
  name: 'テストキャンプ場',
  area: '大阪',
  address: '大阪府テスト市1-1',
  lat: 34.6937,
  lng: 135.5023,
  price_min: 3000,
  amenities: ['toilet'],
  booking_url: 'https://example.com',
  image_url: '',
  description: 'テスト説明',
  pros: [],
  cons: [],
}

beforeEach(() => {
  useFavoritesStore.setState({ campIds: [] })
})

describe('CampCard', () => {
  it('キャンプ場名を表示する', () => {
    render(<CampCard camp={camp} />)
    expect(screen.getByText('テストキャンプ場')).toBeInTheDocument()
  })

  it('image_urlがある場合はimgタグを表示する', () => {
    render(<CampCard camp={camp} />)
    const img = screen.getByRole('img', { name: 'テストキャンプ場' })
    expect(img).toHaveAttribute('src', camp.image_url)
  })

  it('image_urlが空の場合はプレースホルダーを表示する', () => {
    const campNoImage = { ...camp, image_url: '' }
    render(<CampCard camp={campNoImage} />)
    expect(screen.queryByRole('img', { name: 'テストキャンプ場' })).toBeNull()
  })

  it('descriptionを表示する', () => {
    render(<CampCard camp={camp} />)
    expect(screen.getByText('清流沿いの自然豊かなサイト。')).toBeInTheDocument()
  })

  it('料金を表示する', () => {
    render(<CampCard camp={camp} />)
    expect(screen.getByText(/2,500/)).toBeInTheDocument()
  })

  it('isVisited=trueのとき「訪問済み」バッジを表示する', () => {
    render(<CampCard camp={camp} isVisited={true} />)
    expect(screen.getByText('訪問済み')).toBeInTheDocument()
  })
})

describe('CampCard お気に入りボタン', () => {
  it('キャンプ場名が表示される', () => {
    render(<CampCard camp={mockCamp} />)
    expect(screen.getByText('テストキャンプ場')).toBeInTheDocument()
  })

  it('♡ ボタンが存在する', () => {
    render(<CampCard camp={mockCamp} />)
    const btn = screen.getByRole('button', { name: 'お気に入りに追加' })
    expect(btn).toBeInTheDocument()
  })

  it('♡ ボタンクリックでお気に入りに追加される', async () => {
    render(<CampCard camp={mockCamp} />)
    const btn = screen.getByRole('button', { name: 'お気に入りに追加' })
    await userEvent.click(btn)
    expect(useFavoritesStore.getState().isFavorite('camp-1')).toBe(true)
    expect(screen.getByRole('button', { name: 'お気に入りから削除' })).toBeInTheDocument()
  })

  it('もう一度クリックでお気に入りから削除される', async () => {
    render(<CampCard camp={mockCamp} />)
    const btn = screen.getByRole('button', { name: 'お気に入りに追加' })
    await userEvent.click(btn)
    const filledBtn = screen.getByRole('button', { name: 'お気に入りから削除' })
    await userEvent.click(filledBtn)
    expect(useFavoritesStore.getState().isFavorite('camp-1')).toBe(false)
    expect(screen.getByRole('button', { name: 'お気に入りに追加' })).toBeInTheDocument()
  })
})
