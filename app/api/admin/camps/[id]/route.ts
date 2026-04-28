import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdminAuth } from '@/lib/adminAuth'

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const { data, error } = await adminSupabase()
    .from('campsites')
    .update(body)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { error } = await adminSupabase().from('campsites').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
