import { NextRequest } from 'next/server'

export function checkAdminAuth(req: NextRequest): boolean {
  return req.cookies.get('admin_session')?.value === 'valid'
}
