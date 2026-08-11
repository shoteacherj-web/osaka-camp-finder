import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BUCKET = 'campsite-images'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(id, {
    sortBy: { column: 'name', order: 'asc' },
  })

  if (error || !data) {
    return NextResponse.json({ images: [] })
  }

  const images = data
    .filter(f => f.name && !f.name.startsWith('.'))
    .map(f => supabaseAdmin.storage.from(BUCKET).getPublicUrl(`${id}/${f.name}`).data.publicUrl)

  return NextResponse.json({ images })
}
