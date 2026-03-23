import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase'

// POST /api/watch-party - Create a watch party
export async function POST(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const {
    film_id,
    film_title,
    film_poster,
    ott_platform,
    scheduled_at,
    max_participants = 20,
  } = await request.json()

  if (!film_title || !ott_platform) {
    return NextResponse.json(
      { error: 'film_title and ott_platform are required' },
      { status: 400 }
    )
  }

  // LEGAL NOTE: Reel only syncs playback timing.
  // Each participant must log in with their own OTT account.
  // No content is streamed through Reel's servers.
  // This is the same legal model as Teleparty / Netflix Party.

  const { data: party, error } = await supabase
    .from('watch_parties')
    .insert({
      host_id: user.id,
      film_id: film_id || null,
      film_title,
      film_poster: film_poster || null,
      ott_platform,
      scheduled_at: scheduled_at || null,
      max_participants,
      status: scheduled_at ? 'scheduled' : 'live',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Add host as participant automatically
  await supabase
    .from('watch_party_participants')
    .insert({ party_id: party.id, user_id: user.id })

  return NextResponse.json({ party })
}

// PATCH /api/watch-party - Sync playback (host only)
export async function PATCH(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { party_id, position, is_playing } = await request.json()

  // Verify user is the host
  const { data: party } = await supabase
    .from('watch_parties')
    .select()
    .eq('id', party_id)
    .eq('host_id', user.id)
    .single()

  if (!party) {
    return NextResponse.json({ error: 'Not the host of this party' }, { status: 403 })
  }

  // Update sync state - participants subscribe to this via Supabase Realtime
  const { error } = await supabase
    .from('watch_parties')
    .update({
      sync_state: { position, is_playing, updated_at: Date.now() },
    })
    .eq('id', party_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}

// GET /api/watch-party?code=xxxxxx - Join by invite code
export async function GET(request: NextRequest) {
  const supabase = createServerClientInstance()
  const code = request.nextUrl.searchParams.get('code')
  const party_id = request.nextUrl.searchParams.get('party_id')

  if (code) {
    const { data: party, error } = await supabase
      .from('watch_parties')
      .select('*, profiles:host_id(username, display_name, avatar_url)')
      .eq('invite_code', code)
      .single()

    if (error || !party) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 })
    }

    return NextResponse.json({ party })
  }

  if (party_id) {
    const { data: party } = await supabase
      .from('watch_parties')
      .select(`
        *,
        profiles:host_id(username, display_name, avatar_url),
        watch_party_participants(user_id, profiles(username, display_name, avatar_url))
      `)
      .eq('id', party_id)
      .single()

    return NextResponse.json({ party })
  }

  return NextResponse.json({ error: 'code or party_id required' }, { status: 400 })
}
