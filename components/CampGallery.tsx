'use client'
import { useEffect, useRef, useState } from 'react'

const AUTO_SLIDE_MS = 4000
const SWIPE_THRESHOLD_PX = 40

export function CampGallery({ campsiteId, name, fallbackImageUrl }: { campsiteId: string; name: string; fallbackImageUrl: string }) {
  const [images, setImages] = useState<string[] | null>(null)
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    setImages(null)
    setIndex(0)
    fetch(`/api/campsite-images/${campsiteId}`)
      .then(res => res.json())
      .then((data: { images: string[] }) => {
        if (!cancelled) setImages(data.images ?? [])
      })
      .catch(() => {
        if (!cancelled) setImages([])
      })
    return () => { cancelled = true }
  }, [campsiteId])

  const slides = images && images.length > 0 ? images : fallbackImageUrl ? [fallbackImageUrl] : []

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, AUTO_SLIDE_MS)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) {
    return <div className="w-full aspect-video bg-gradient-to-br from-green-900 to-green-500" />
  }

  const goPrev = () => setIndex(i => (i - 1 + slides.length) % slides.length)
  const goNext = () => setIndex(i => (i + 1) % slides.length)

  return (
    <div
      className="relative w-full aspect-video bg-gray-100 overflow-hidden select-none"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const delta = e.changedTouches[0].clientX - touchStartX.current
        if (delta > SWIPE_THRESHOLD_PX) goPrev()
        else if (delta < -SWIPE_THRESHOLD_PX) goNext()
        touchStartX.current = null
      }}
    >
      {slides.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`${name} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="前の画像"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-lg"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="次の画像"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center text-lg"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}枚目を表示`}
                className={`w-1.5 h-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
