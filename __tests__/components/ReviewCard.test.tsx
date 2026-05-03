import { render, screen } from '@testing-library/react'
import { ReviewCard } from '@/components/ReviewCard'
import type { Review } from '@/types'

const mockReview: Review = {
  id: 'r-1', campsite_id: 'camp-1', rating: 4,
  comment: 'とても景色が良かった', visit_date: '2026-04-01', created_at: '2026-04-02T00:00:00Z',
}

describe('ReviewCard', () => {
  it('コメントが表示される', () => {
    render(<ReviewCard review={mockReview} />)
    expect(screen.getByText('とても景色が良かった')).toBeInTheDocument()
  })
  it('評価の星が表示される', () => {
    render(<ReviewCard review={mockReview} />)
    expect(screen.getByText('★★★★☆')).toBeInTheDocument()
  })
  it('訪問日が表示される', () => {
    render(<ReviewCard review={mockReview} />)
    expect(screen.getByText('2026-04-01')).toBeInTheDocument()
  })
})
