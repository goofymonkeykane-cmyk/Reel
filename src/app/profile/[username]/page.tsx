import { createServerClientInstance } from '@/lib/supabase'
import { tmdbImage } from '@/lib/tmdb'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `${params.username} — Reel` }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()

  // Get the profile being viewed
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const isOwnProfile = user?.id === profile.id

  // Get recent film logs
  const { data: recentLogs } = await supabase
    .from('film_logs')
    .select('*')
    .eq('user_id', profile.id)
    .order('watched_date', { ascending: false })
    .limit(24)

  // Get recent reviews (logs with review text)
  const { data: reviews } = await supabase
    .from('film_logs')
    .select('*')
    .eq('user_id', profile.id)
    .not('review', 'is', null)
    .order('watched_date', { ascending: false })
    .limit(5)

  // Rating distribution
  const { data: allLogs } = await supabase
    .from('film_logs')
    .select('rating')
    .eq('user_id', profile.id)
    .not('rating', 'is', null)

  const ratingDist = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].map(r => ({
    rating: r,
    count: allLogs?.filter(l => l.rating === r).length || 0,
  }))
  const maxCount = Math.max(...ratingDist.map(r => r.count), 1)

  const tabs = ['Profile', 'Films', 'Diary', 'Reviews', 'Watchlist', 'Lists']

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <Link href="/films" style={{ fontSize: '12px', color: '#928ea0', textDecoration: 'none' }}>Films</Link>
        <Link href="/search" style={{ fontSize: '12px', color: '#928ea0', textDecoration: 'none' }}>Search</Link>
        <div style={{ flex: 1 }} />
        {isOwnProfile && (
          <Link href="/settings" style={{ fontSize: '12px', color: '#928ea0', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.11)', padding: '5px 12px', borderRadius: '20px' }}>
            Edit profile
          </Link>
        )}
      </nav>

      {/* Backdrop */}
      <div style={{
        height: '180px', position: 'relative', overflow: 'hidden',
        background: profile.backdrop_url
          ? 'transparent'
          : 'linear-gradient(135deg,#080012,#001028,#120008)',
      }}>
        {profile.backdrop_url && (
          <img src={profile.backdrop_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #08080d)' }} />
        {isOwnProfile && (
          <Link href="/settings" style={{
            position: 'absolute', bottom: '10px', right: '12px',
            fontSize: '11px', color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)',
            padding: '3px 10px', borderRadius: '20px', textDecoration: 'none',
          }}>
            Change backdrop
          </Link>
        )}
      </div>

      {/* Profile header */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginTop: '-40px', position: 'relative', zIndex: 2 }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#7b69ee,#c8a76b)',
            border: '3px solid #08080d', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: '500',
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.display_name || profile.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (profile.display_name?.[0] || profile.username[0]).toUpperCase()
            }
          </div>

          <div style={{ flex: 1, paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '22px' }}>
                {profile.display_name || profile.username}
              </span>
              {profile.is_verified && (
                <span style={{ fontSize: '11px', background: 'rgba(69,190,160,0.1)', border: '1px solid rgba(69,190,160,0.25)', color: '#45bea0', padding: '2px 8px', borderRadius: '20px' }}>
                  Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#4d4a58', marginTop: '2px' }}>@{profile.username}</div>
            {profile.bio && (
              <div style={{ fontSize: '13px', color: '#928ea0', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.5' }}>
                {profile.bio}
              </div>
            )}
            {profile.letterboxd_username && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px',
                fontSize: '11px', color: '#45bea0',
                background: 'rgba(69,190,160,0.08)', border: '1px solid rgba(69,190,160,0.2)',
                padding: '2px 8px', borderRadius: '20px',
              }}>
                Letterboxd: @{profile.letterboxd_username}
              </div>
            )}
          </div>

          {/* Follow/message button */}
          {!isOwnProfile && user && (
            <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
              <button style={{
                padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                Follow
              </button>
              <button style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '12px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                Message
              </button>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: '0', marginTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { n: profile.films_count, l: 'Films' },
            { n: allLogs?.length || 0, l: 'Ratings' },
            { n: reviews?.length || 0, l: 'Reviews' },
            { n: profile.following_count, l: 'Following' },
            { n: profile.followers_count, l: 'Followers' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center', padding: '12px 8px',
              borderRight: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#ede9e3' }}>{s.n}</div>
              <div style={{ fontSize: '9px', color: '#4d4a58', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
          {tabs.map((tab, i) => (
            <div key={tab} style={{
              padding: '10px 14px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
              color: i === 0 ? '#ede9e3' : '#928ea0',
              borderBottom: i === 0 ? '2px solid #7b69ee' : '2px solid transparent',
            }}>
              {tab}
            </div>
          ))}
        </div>

        {/* Profile content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '24px', padding: '20px 0' }}>

          {/* Left: Recent films */}
          <div>
            {/* Favourite films */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
                Favourite films
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    flex: 1, aspectRatio: '2/3', borderRadius: '7px',
                    background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', cursor: isOwnProfile ? 'pointer' : 'default',
                    color: '#4d4a58',
                  }}>
                    {isOwnProfile ? '+' : '🎬'}
                  </div>
                ))}
              </div>
              {isOwnProfile && (
                <div style={{ fontSize: '11px', color: '#4d4a58', marginTop: '6px', textAlign: 'center' }}>
                  Click to add your 4 favourite films
                </div>
              )}
            </div>

            {/* Recent diary */}
            {recentLogs && recentLogs.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>Recent films</div>
                  <span style={{ fontSize: '11px', color: '#c8a76b', cursor: 'pointer' }}>All {profile.films_count} →</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(60px,1fr))', gap: '5px' }}>
                  {recentLogs.slice(0, 20).map((log, i) => (
                    <Link key={i} href={`/films/${log.film_id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        aspectRatio: '2/3', borderRadius: '5px', background: '#1a1a24',
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                        overflow: 'hidden',
                      }}>
                        🎬
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent reviews */}
            {reviews && reviews.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
                  Recent reviews
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reviews.map((log: any) => (
                    <div key={log.id} style={{
                      background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px', padding: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(i => (
                            <div key={i} style={{
                              width: '9px', height: '9px',
                              background: log.rating && i <= Math.round(log.rating) ? '#c8a76b' : 'rgba(255,255,255,0.1)',
                              clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                            }} />
                          ))}
                        </div>
                        {log.is_rewatch && (
                          <span style={{ fontSize: '10px', color: '#45bea0' }}>Rewatch</span>
                        )}
                        <span style={{ fontSize: '10px', color: '#4d4a58', marginLeft: 'auto' }}>
                          {new Date(log.watched_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#928ea0', fontStyle: 'italic', lineHeight: '1.6', borderLeft: '2px solid #c8a76b', paddingLeft: '10px' }}>
                        "{log.review}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {profile.films_count === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎬</div>
                <div style={{ fontSize: '14px', color: '#ede9e3', marginBottom: '6px' }}>No films logged yet</div>
                {isOwnProfile && (
                  <Link href="/search" style={{
                    display: 'inline-block', marginTop: '12px',
                    padding: '8px 20px', borderRadius: '20px', fontSize: '13px',
                    background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
                  }}>
                    Log your first film
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div>
            {/* Ratings chart */}
            {allLogs && allLogs.length > 0 && (
              <div style={{
                background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '14px', marginBottom: '14px',
              }}>
                <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
                  Ratings · {allLogs.length}
                </div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '48px', marginBottom: '4px' }}>
                  {ratingDist.map(r => (
                    <div key={r.rating} style={{
                      flex: 1, background: '#45bea0', borderRadius: '2px 2px 0 0',
                      height: `${(r.count / maxCount) * 100}%`,
                      minHeight: r.count > 0 ? '3px' : '0', opacity: 0.8,
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4d4a58' }}>
                  <span>★</span><span>★★★</span><span>★★★★★</span>
                </div>
              </div>
            )}

            {/* Taste profile */}
            <div style={{
              background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', padding: '14px',
            }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
                Taste profile
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {['Action', 'Thriller', 'Drama', 'Hindi', 'English'].map(tag => (
                  <div key={tag} style={{
                    fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                    background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', color: '#928ea0',
                  }}>
                    {tag}
                  </div>
                ))}
              </div>
              {isOwnProfile && (
                <Link href="/onboarding" style={{ display: 'block', marginTop: '10px', fontSize: '11px', color: '#7b69ee', textDecoration: 'none' }}>
                  Update taste profile →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
