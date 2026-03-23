import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notifications — Reel' }

export default async function NotificationsPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Mark all as read
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Notifications</span>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>
        {notifications && notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {notifications.map((n: any) => (
              <div key={n.id} style={{
                display: 'flex', gap: '12px', padding: '12px',
                background: n.is_read ? 'transparent' : 'rgba(123,105,238,0.06)',
                border: '1px solid',
                borderColor: n.is_read ? 'rgba(255,255,255,0.04)' : 'rgba(123,105,238,0.15)',
                borderRadius: '10px', cursor: 'pointer',
              }}>
                {n.image_url ? (
                  <img src={n.image_url} alt="" style={{ width: '40px', height: '56px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1a1a24', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    🔔
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#ede9e3' }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: '12px', color: '#928ea0', marginTop: '3px', lineHeight: '1.5' }}>{n.body}</div>}
                  <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '4px' }}>
                    {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>No notifications yet</div>
            <div style={{ fontSize: '13px', color: '#928ea0' }}>
              Follow people and lock in on cast and crew to get notified
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
