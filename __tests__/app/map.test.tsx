import { render, screen } from '@testing-library/react'
import MapPage from '@/app/map/page'

jest.mock('@/hooks/useCamps', () => ({
  useCamps: () => ({
    camps: [
      {
        id: 'camp-1', name: 'キャンプ場A', area: '大阪', address: '大阪府テスト市',
        lat: 34.69, lng: 135.50, price_min: 3000, amenities: [], booking_url: '',
        image_url: '', description: '', pros: [], cons: [],
      },
    ],
    loading: false,
  }),
}))

jest.mock('@/components/CampsiteMapView', () => ({
  CampsiteMapView: ({ camps }: { camps: unknown[] }) => (
    <div data-testid="campsite-map-view">camps: {camps.length}</div>
  ),
}))

jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('MapPage', () => {
  it('ページタイトル「マップ」が表示される', () => {
    render(<MapPage />)
    expect(screen.getByText('マップ')).toBeInTheDocument()
  })

  it('キャンプ場件数が表示される', () => {
    render(<MapPage />)
    expect(screen.getByText('1件のキャンプ場')).toBeInTheDocument()
  })

  it('data-testid="campsite-map-view" が存在する', () => {
    render(<MapPage />)
    expect(screen.getByTestId('campsite-map-view')).toBeInTheDocument()
  })

  it('camps の件数が正しく渡されている', () => {
    render(<MapPage />)
    expect(screen.getByTestId('campsite-map-view')).toHaveTextContent('camps: 1')
  })
})
