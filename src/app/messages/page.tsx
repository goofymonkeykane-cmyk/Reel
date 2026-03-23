import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Messages — Reel' }

export default async function MessagesPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get conversations
  const { data: participants } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', user.id)

  const conversationIds = participants?.map(p => p.conversation_id) || []

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Messages</span>
      </nav>

      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
        {conversationIds.length === 0 ? (
          <div style={{
            background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px', padding: '60px 40px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px', marginBottom: '10px' }}>
              No messages yet
            </div>
            <div style={{ fontSize: '14px', color: '#928ea0', lineHeight: '1.7', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              Find cinephiles who share your taste, follow them, and start a conversation about the films you both love.
            </div>
            <Link href="/discover" style={{
              padding: '10px 24px', borderRadius: '20px', fontSize: '14px',
              background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
              textDecoration: 'none', fontWeight: '500',
            }}>
              Find cinephiles to message →
            </Link>
          </div>
        ) : (
          <div style={{ background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '14px', color: '#928ea0' }}>
              You have {conversationIds.length} conversations. Full DM interface coming soon.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
