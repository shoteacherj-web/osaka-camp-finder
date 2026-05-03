import type { Review } from '@/types'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

type Props = { review: Review }

export function ReviewCard({ review }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-1.5">
        <Stars rating={review.rating} />
        <span className="text-xs text-gray-400">{review.visit_date}</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  )
}
