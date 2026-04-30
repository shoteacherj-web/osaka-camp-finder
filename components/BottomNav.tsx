'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCompareStore } from '@/stores/compareStore'

export function BottomNav() {
  const pathname = usePathname()
  const { campIds } = useCompareStore()

  if (pathname.startsWith('/admin')) return null

  const navItems = [
    { href: '/compare', label: 'お気に入り', icon: '♡', badge: campIds.length },
    { href: '/logs', label: '記録', icon: '📓', badge: 0 },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20">
      {navItems.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-medium relative ${active ? 'text-green-600' : 'text-gray-400'}`}
          >
            <span className="text-xl mb-0.5">{item.icon}</span>
            {item.label}
            {item.badge > 0 && (
              <span className="absolute top-1 right-1/4 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
