'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  return createPortal(
    <>
      <div
        data-testid="bottom-sheet-overlay"
        className="fixed inset-0 bg-black/40 z-[100]"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-[110] max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        {children}
      </div>
    </>,
    document.body
  )
}
