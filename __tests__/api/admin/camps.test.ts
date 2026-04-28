/** @jest-environment node */
import { GET, POST } from '@/app/api/admin/camps/route'
import { NextRequest } from 'next/server'

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({ data: [], error: null }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({ data: { id: 'c1' }, error: null }),
        }),
      }),
    })),
  })),
}))

function makeReq(url: string, cookie = '') {
  return new NextRequest(url, { headers: cookie ? { cookie } : {} })
}

describe('GET /api/admin/camps', () => {
  it('認証なしで 401 を返す', async () => {
    const res = await GET(makeReq('http://localhost/api/admin/camps'))
    expect(res.status).toBe(401)
  })

  it('有効なクッキーで 200 を返す', async () => {
    const res = await GET(makeReq('http://localhost/api/admin/camps', 'admin_session=valid'))
    expect(res.status).toBe(200)
  })
})

describe('POST /api/admin/camps', () => {
  it('認証なしで 401 を返す', async () => {
    const req = new NextRequest('http://localhost/api/admin/camps', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})
