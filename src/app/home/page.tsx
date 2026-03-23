import { createServerClientInstance } from '@/lib/supabase'
import { getTrending, getUpcoming, tmdbImage } from '@/lib/tmdb'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Home' }

export default async function HomePage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get recent activity from people user follows
  const { data: recentActivity } = await supabase
    .from('film_logs')
    .select('*, profiles(username, display_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20)

  // Get trending films from TMDB
  let trending: any[] = []
  let upcoming: any[] = []
  try {
    const trendingData = await getTrending('week')
    trending = trendingData.results?.slice(0, 12) || []
    const upcomingData = await getUpcoming(1, 'IN')
    upcoming = upcomingData.results?.slice(0, 6) || []
  } catch (e) {}

  // Get unread notification count
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Top navigation */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '0',
        padding: '0 0', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ padding: '0 16px', fontFamily: 'DM Serif Display, serif', fontSize: '18px' }}>reel</div>

        {/* Nav links */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {[
            { href: '/home', label: 'Feed', active: true },
            { href: '/films', label: 'Films' },
            { href: '/search', label: 'Search' },
            { href: '/community', label: 'Community' },
            { href: '/schedule', label: 'Schedule' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '0 12px', height: '46px', display: 'flex', alignItems: 'center',
              fontSize: '12px', fontWeight: '500', textDecoration: 'none',
              color: link.active ? '#c8a76b' : '#928ea0',
              borderBottom: link.active ? '2px solid #c8a76b' : '2px solid transparent',
              whiteSpace: 'nowrap',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px' }}>
          <Link href="/messages" style={{
            width: '30px', height: '30px', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#928ea0', textDecoration: 'none', background: '#1a1a24',
            border: '1px solid rgba(255,255,255,0.06)', fontSize: '14px',
          }}>
            💬
          </Link>
          <Link href="/notifications" style={{
            width: '30px', height: '30px', borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#928ea0', textDecoration: 'none', background: '#1a1a24',
            border: '1px solid rgba(255,255,255,0.06)', fontSize: '14px',
            position: 'relative',
          }}>
            🔔
            {(unreadCount || 0) > 0 && (
              <div style={{
                position: 'absolute', top: '2px', right: '2px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#e05050', border: '1.5px solid #0f0f16',
              }} />
            )}
          </Link>
          <Link href={`/profile/${profile?.username}`} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#7b69ee,#c8a76b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '500', color: '#fff', textDecoration: 'none',
          }}>
            {profile?.display_name?.[0] || profile?.username?.[0] || 'U'}
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>

        {/* Main feed */}
        <div>
          {/* Welcome banner for new users */}
          {profile && profile.films_count === 0 && (
            <div style={{
              background: 'rgba(123,105,238,0.08)', border: '1px solid rgba(123,105,238,0.2)',
              borderRadius: '12px', padding: '16px', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#ede9e3', marginBottom: '6px' }}>
                Welcome to Reel, {profile.display_name || profile.username} 🎬
              </div>
              <div style={{ fontSize: '13px', color: '#928ea0', lineHeight: '1.6', marginBottom: '12px' }}>
                Start by logging films you have watched, then find cinephiles who share your taste.
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Link href="/search" style={{
                  padding: '7px 16px', borderRadius: '20px', fontSize: '12px',
                  background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
                }}>
                  Log your first film
                </Link>
                <Link href="/discover" style={{
                  padding: '7px 16px', borderRadius: '20px', fontSize: '12px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0', textDecoration: 'none',
                }}>
                  Find cinephiles
                </Link>
              </div>
            </div>
          )}

          {/* Trending films section */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>
                Trending this week
              </div>
              <Link href="/films" style={{ fontSize: '11px', color: '#c8a76b', textDecoration: 'none' }}>All films →</Link>
            </div>

            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {trending.map((film: any) => {
                const isTV = film.media_type === 'tv'
                const title = film.title || film.name
                const poster = tmdbImage.poster(film.poster_path, 'w342')
                return (
                  <Link key={film.id} href={`/films/${film.id}${isTV ? '?type=tv' : ''}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{ width: '90px' }}>
                      <div style={{
                        width: '90px', height: '130px', borderRadius: '8px',
                        overflow: 'hidden', background: '#1a1a24',
                        border: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px',
                      }}>
                        {poster
                          ? <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🎬</div>
                        }
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.3' }}>
                        {title}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '14px' }}>
              {recentActivity && recentActivity.length > 0 ? 'Recent activity' : 'Discover what people are watching'}
            </div>

            {recentActivity && recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.map((log: any) => (
                  <div key={log.id} style={{
                    background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px', padding: '14px',
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg,#7b69ee,#45bea0)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: '500',
                      }}>
                        {log.profiles?.display_name?.[0] || log.profiles?.username?.[0] || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#ede9e3', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '500' }}>{log.profiles?.display_name || log.profiles?.username}</span>
                          <span style={{ color: '#928ea0' }}> {log.is_rewatch ? 'rewatched' : 'watched'} a film</span>
                        </div>
                        {log.rating && (
                          <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                            {[1,2,3,4,5].map(i => (
                              <div key={i} style={{
                                width: '9px', height: '9px',
                                background: i <= Math.round(log.rating) ? '#c8a76b' : 'rgba(255,255,255,0.1)',
                                clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                              }} />
                            ))}
                          </div>
                        )}
                        {log.review && (
                          <div style={{ fontSize: '13px', color: '#928ea0', fontStyle: 'italic', lineHeight: '1.5' }}>
                            "{log.review.slice(0, 120)}{log.review.length > 120 ? '...' : ''}"
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '4px' }}>
                          {new Date(log.watched_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty state - show suggestions */
              <div style={{ textAlign: 'center', padding: '40px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎬</div>
                <div style={{ fontSize: '14px', color: '#ede9e3', marginBottom: '6px' }}>Your feed is empty</div>
                <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '16px' }}>
                  Follow some cinephiles to see what they are watching
                </div>
                <Link href="/discover" style={{
                  padding: '8px 20px', borderRadius: '20px', fontSize: '13px',
                  background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
                }}>
                  Find cinephiles →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div>
          {/* Your stats */}
          <div style={{
            background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '14px', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '12px' }}>
              Your stats
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { n: profile?.films_count || 0, l: 'Films' },
                { n: profile?.followers_count || 0, l: 'Followers' },
                { n: profile?.following_count || 0, l: 'Following' },
                { n: 0, l: 'Lists' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: '#1a1a24', borderRadius: '8px', padding: '10px',
                  textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div style={{ fontSize: '18px', fontWeight: '500', color: '#ede9e3' }}>{s.n}</div>
                  <div style={{ fontSize: '9px', color: '#4d4a58', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.l}</div>
                </div>
              ))}
            </div>
            <Link href={`/profile/${profile?.username}`} style={{
              display: 'block', marginTop: '10px', textAlign: 'center',
              fontSize: '12px', color: '#928ea0', textDecoration: 'none',
            }}>
              View full profile →
            </Link>
          </div>

          {/* Upcoming films */}
          {upcoming.length > 0 && (
            <div style={{
              background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', padding: '14px', marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>Upcoming · India</div>
                <Link href="/schedule" style={{ fontSize: '11px', color: '#c8a76b', textDecoration: 'none' }}>Schedule →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {upcoming.slice(0, 4).map((film: any) => (
                  <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '40px', borderRadius: '4px', background: '#1a1a24', overflow: 'hidden', flexShrink: 0 }}>
                      {film.poster_path
                        ? <img src={`https://image.tmdb.org/t/p/w92${film.poster_path}`} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🎬</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{film.title}</div>
                      <div style={{ fontSize: '10px', color: '#4d4a58' }}>{film.release_date}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div style={{
            background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '10px', padding: '14px',
          }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>Quick links</div>
            {[
              { href: '/watchlist', label: 'My Watchlist' },
              { href: '/lists', label: 'My Lists' },
              { href: '/community', label: 'Community Clubs' },
              { href: '/discover', label: 'Find Cinephiles' },
              { href: '/stats', label: 'My Statistics' },
              { href: '/donate', label: '❤️ Support Reel' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block', padding: '7px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '13px', color: link.label.includes('Support') ? '#c8a76b' : '#928ea0',
                textDecoration: 'none',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
