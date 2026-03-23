import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase'

// GET /api/messages - Get conversations list
export async function GET(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const conversation_id = request.nextUrl.searchParams.get('conversation_id')

  if (conversation_id) {
    // Get messages in a specific conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, profiles:sender_id(username, display_name, avatar_url)')
      .eq('conversation_id', conversation_id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ messages })
  }

  // Get all conversations for user
  const { data: conversations, error } = await supabase
    .from('conversation_participants')
    .select(`
      conversation_id,
      last_read_at,
      conversations(id, created_at),
      profiles:user_id(username, display_name, avatar_url)
    `)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ conversations })
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  const supabase = createServerClientInstance()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { conversation_id, content, message_type = 'text', metadata } = await request.json()

  if (!conversation_id || !content) {
    return NextResponse.json({ error: 'conversation_id and content required' }, { status: 400 })
  }

  // Verify user is participant
  const { data: participant } = await supabase
    .from('conversation_participants')
    .select()
    .eq('conversation_id', conversation_id)
    .eq('user_id', user.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: 'Not a participant in this conversation' }, { status: 403 })
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id,
      sender_id: user.id,
      content,
      message_type,
      metadata: metadata || null,
    })
    .select('*, profiles:sender_id(username, display_name, avatar_url)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message })
}
