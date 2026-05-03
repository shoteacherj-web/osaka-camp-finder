import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CampsiteMapView } from '@/components/CampsiteMapView'
import type { Campsite } from '@/types'

jest.mock('@vis.gl/react-google-maps', () => ({
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  AdvancedMarker: ({ onClick, title }: { onClick: () => void; title: string }) => (
    <button type="button" onClick={onClick} aria-label={title}>marker</button>
  ),
  InfoWindow: ({ children, onCloseClick }: { children: React.ReactNode; onCloseClick: () => void }) => (
    <div data-testid="info-window">
      {children}
      <button type="button" onClick={onCloseClick}>close</button>
    </div>
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

const mockCamps: Campsite[] = [
  {
    id: 'camp-1',
    name: 'キャンプ場A',
    area: '大阪',
    address: '大阪府テスト市',
    lat: 34.69,
    lng: 135.50,
    price_min: 3000,
    amenities: ['toilet'],
    booking_url: '',
    image_url: '',
    description: '',
    pros: [],
    cons: [],
  },
  {
    id: 'camp-2',
    name: 'キャンプ場B',
    area: '兵庫',
    address: '兵庫県テスト市',
    lat: 34.80,
    lng: 135.40,
    price_min: 5000,
    amenities: ['shower'],
    booking_url: '',
    image_url: '',
    description: '',
    pros: [],
    cons: [],
  },
]

describe('CampsiteMapView', () => {
  it('google-map が表示される', () => {
    render(<CampsiteMapView camps={mockCamps} />)
    expect(screen.getByTestId('google-map')).toBeInTheDocument()
  })

  it('各キャンプ場のマーカーボタンが aria-label で表示される', () => {
    render(<CampsiteMapView camps={mockCamps} />)
    expect(screen.getByRole('button', { name: 'キャンプ場A' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンプ場B' })).toBeInTheDocument()
  })

  it('マーカークリックで InfoWindow が表示される', async () => {
    render(<CampsiteMapView camps={mockCamps} />)
    const markerA = screen.getByRole('button', { name: 'キャンプ場A' })
    await userEvent.click(markerA)
    expect(screen.getByTestId('info-window')).toBeInTheDocument()
  })

  it('InfoWindow にキャンプ場名が表示される', async () => {
    render(<CampsiteMapView camps={mockCamps} />)
    const markerA = screen.getByRole('button', { name: 'キャンプ場A' })
    await userEvent.click(markerA)
    expect(screen.getByTestId('info-window')).toHaveTextContent('キャンプ場A')
  })

  it('InfoWindow の close ボタンで InfoWindow が消える', async () => {
    render(<CampsiteMapView camps={mockCamps} />)
    const markerA = screen.getByRole('button', { name: 'キャンプ場A' })
    await userEvent.click(markerA)
    expect(screen.getByTestId('info-window')).toBeInTheDocument()
    const closeBtn = screen.getByRole('button', { name: 'close' })
    await userEvent.click(closeBtn)
    expect(screen.queryByTestId('info-window')).not.toBeInTheDocument()
  })
})
