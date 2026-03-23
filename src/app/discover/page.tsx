import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Find Cinephiles — Reel' }

export default async function DiscoverPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Get other users to discover (in production this would use taste scores)
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .order('films_count', { ascending: false })
    .limit(20)

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <Link href="/home" style={{ fontSize: '12px', color: '#928ea0', textDecoration: 'none' }}>← Home</Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '6px' }}>
            Find your <span style={{ color: '#c8a76b' }}>film people</span>
          </div>
          <div style={{ fontSize: '14px', color: '#928ea0' }}>
            Cinephiles matched by taste. The more films you log, the better your matches.
          </div>
        </div>

        {users && users.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {users.map((u: any) => (
              <div key={u.id} style={{
                background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#7b69ee,#45bea0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '500',
                  }}>
                    {(u.display_name?.[0] || u.username[0]).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#ede9e3' }}>
                      {u.display_name || u.username}
                    </div>
                    <div style={{ fontSize: '11px', color: '#4d4a58' }}>@{u.username}</div>
                    {u.bio && (
                      <div style={{ fontSize: '12px', color: '#928ea0', marginTop: '4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {u.bio}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '11px' }}>
                  <span style={{ color: '#928ea0' }}><span style={{ color: '#ede9e3', fontWeight: '500' }}>{u.films_count}</span> films</span>
                  <span style={{ color: '#928ea0' }}><span style={{ color: '#ede9e3', fontWeight: '500' }}>{u.followers_count}</span> followers</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link href={`/profile/${u.username}`} style={{
                    flex: 1, padding: '7px', borderRadius: '8px', fontSize: '12px', textAlign: 'center',
                    background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.25)',
                    color: '#c8a76b', textDecoration: 'none',
                  }}>
                    View profile
                  </Link>
                  <button style={{
                    flex: 1, padding: '7px', borderRadius: '8px', fontSize: '12px',
                    background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>No cinephiles yet</div>
            <div style={{ fontSize: '13px', color: '#928ea0' }}>
              Be the first to sign up and share the link with fellow film lovers
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
