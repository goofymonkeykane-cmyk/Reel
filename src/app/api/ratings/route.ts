import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase'

// POST /api/ratings - Log or rate a film
export async function POST(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const {
    film_id,
    film_title,
    film_poster,
    rating,
    review,
    watched_date,
    is_rewatch,
    liked,
    contains_spoilers,
  } = body

  if (!film_id) {
    return NextResponse.json({ error: 'film_id is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('film_logs')
      .upsert({
        user_id: user.id,
        film_id,
        rating: rating || null,
        review: review || null,
        watched_date: watched_date || new Date().toISOString().split('T')[0],
        is_rewatch: is_rewatch || false,
        liked: liked || false,
        review_contains_spoilers: contains_spoilers || false,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,film_id,watched_date',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, log: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/ratings?film_id=123 - Get user's rating for a film
export async function GET(request: NextRequest) {
  const supabase = createServerClientInstance()
  const film_id = request.nextUrl.searchParams.get('film_id')
  const username = request.nextUrl.searchParams.get('username')

  if (!film_id) {
    return NextResponse.json({ error: 'film_id required' }, { status: 400 })
  }

  let query = supabase
    .from('film_logs')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('film_id', film_id)
    .order('watched_date', { ascending: false })

  if (username) {
    query = query.eq('profiles.username', username)
  }

  const { data, error } = await query.limit(50)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ logs: data })
}

// DELETE /api/ratings?log_id=xxx - Delete a log entry
export async function DELETE(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const log_id = request.nextUrl.searchParams.get('log_id')
  if (!log_id) {
    return NextResponse.json({ error: 'log_id required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('film_logs')
    .delete()
    .eq('id', log_id)
    .eq('user_id', user.id) // Security: can only delete own logs

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
