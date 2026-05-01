import { render, screen } from '@testing-library/react'
import { useFavoritesStore } from '@/stores/favoritesStore'
import ComparePage from '@/app/compare/page'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

jest.mock('@/hooks/useCamps', () => ({
  useCamps: () => ({
    camps: [
      {
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
        description: 'テスト',
        pros: [],
        cons: [],
      },
    ],
    loading: false,
  }),
}))

jest.mock('@/components/CompareCard', () => ({
  CompareCard: ({ camp }: { camp: { name: string } }) => <div>{camp.name}</div>,
}))

beforeEach(() => {
  useFavoritesStore.setState({ campIds: [] })
})

describe('ComparePage (お気に入りページ)', () => {
  it('favoritesStore が空のとき「お気に入りがありません」が表示される', () => {
    render(<ComparePage />)
    expect(screen.getByText('お気に入りがありません')).toBeInTheDocument()
  })

  it('favoritesStore に camp-1 があるとき「テストキャンプ場」が表示される', () => {
    useFavoritesStore.setState({ campIds: ['camp-1'] })
    render(<ComparePage />)
    expect(screen.getByText('テストキャンプ場')).toBeInTheDocument()
  })
})
