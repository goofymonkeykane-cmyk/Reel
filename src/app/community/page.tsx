import { createServerClientInstance } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Community — Reel' }

export default async function CommunityPage() {
  const supabase = createServerClientInstance()

  const { data: clubs } = await supabase
    .from('clubs')
    .select('*')
    .order('members_count', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Community</span>
        <div style={{ flex: 1 }} />
        <Link href="/auth/signup" style={{
          padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
          background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
        }}>Join to post</Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '6px' }}>Community Clubs</div>
          <div style={{ fontSize: '14px', color: '#928ea0' }}>
            Cinema communities for every taste. Join a club, post, discuss, connect.
          </div>
        </div>

        {clubs && clubs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {clubs.map((club: any) => (
              <div key={club.id} style={{
                background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', overflow: 'hidden',
              }}>
                <div style={{
                  height: '80px', background: 'linear-gradient(135deg,#080012,#001028)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '36px',
                }}>
                  {club.icon}
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#ede9e3', marginBottom: '4px' }}>
                    {club.name}
                    {club.is_official && (
                      <span style={{
                        marginLeft: '6px', fontSize: '10px',
                        background: 'rgba(69,190,160,0.1)', border: '1px solid rgba(69,190,160,0.25)',
                        color: '#45bea0', padding: '1px 6px', borderRadius: '20px',
                      }}>
                        Official
                      </span>
                    )}
                  </div>
                  {club.description && (
                    <div style={{ fontSize: '12px', color: '#928ea0', lineHeight: '1.5', marginBottom: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {club.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#4d4a58' }}>
                      {club.members_count} members · {club.posts_count} posts
                    </span>
                    <Link href="/auth/signup" style={{
                      padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
                      background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
                      textDecoration: 'none', fontWeight: '500',
                    }}>
                      Join
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>Setting up clubs</div>
            <div style={{ fontSize: '13px', color: '#928ea0' }}>
              Run the database schema to create the default clubs
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
