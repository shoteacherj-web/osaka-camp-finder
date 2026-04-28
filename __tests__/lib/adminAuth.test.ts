/** @jest-environment node */
import { checkAdminAuth } from '@/lib/adminAuth'
import { NextRequest } from 'next/server'

describe('checkAdminAuth', () => {
  it('クッキーがない場合は false を返す', () => {
    const req = new NextRequest('http://localhost/api/admin/camps')
    expect(checkAdminAuth(req)).toBe(false)
  })

  it('有効なクッキーがある場合は true を返す', () => {
    const req = new NextRequest('http://localhost/api/admin/camps', {
      headers: { cookie: 'admin_session=valid' },
    })
    expect(checkAdminAuth(req)).toBe(true)
  })
})
