import { render, screen } from '@testing-library/react'
import { BottomNav } from '@/components/BottomNav'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

jest.mock('@/stores/compareStore', () => ({
  useCompareStore: () => ({ campIds: [] }),
}))

describe('BottomNav', () => {
  it('「マップ」リンクが表示される', () => {
    render(<BottomNav />)
    expect(screen.getByText('マップ')).toBeInTheDocument()
  })

  it('「マップ」リンクが /map を指す', () => {
    render(<BottomNav />)
    const mapLink = screen.getByText('マップ').closest('a')
    expect(mapLink).toHaveAttribute('href', '/map')
  })

  it('「さがす」リンクが表示される', () => {
    render(<BottomNav />)
    expect(screen.getByText('さがす')).toBeInTheDocument()
  })

  it('「お気に入り」リンクが表示される', () => {
    render(<BottomNav />)
    expect(screen.getByText('お気に入り')).toBeInTheDocument()
  })

  it('「記録」リンクが表示される', () => {
    render(<BottomNav />)
    expect(screen.getByText('記録')).toBeInTheDocument()
  })
})
