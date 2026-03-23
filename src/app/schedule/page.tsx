import { getReleasingThisWeek, getUpcoming, tmdbImage } from '@/lib/tmdb'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Release Schedule — Reel' }

export default async function SchedulePage() {
  let thisWeek: any[] = []
  let upcoming: any[] = []

  try {
    const weekData = await getReleasingThisWeek('IN')
    thisWeek = weekData.results || []
    const upcomingData = await getUpcoming(1, 'IN')
    upcoming = upcomingData.results?.filter((f: any) => {
      const releaseDate = new Date(f.release_date)
      const weekFromNow = new Date()
      weekFromNow.setDate(weekFromNow.getDate() + 7)
      return releaseDate > weekFromNow
    }) || []
  } catch (e) {}

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <Link href="/films" style={{ fontSize: '12px', color: '#928ea0', textDecoration: 'none' }}>Films</Link>
        <div style={{ flex: 1 }} />
        <Link href="/auth/signup" style={{
          padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
          background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
        }}>Join free</Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '28px', marginBottom: '4px' }}>
            Release Schedule
          </div>
          <div style={{ fontSize: '13px', color: '#928ea0' }}>{today} · India</div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['All', 'Movies', 'Series', 'Anime', 'In Theatre', 'Streaming', 'Bollywood', 'Hollywood', 'South Indian', 'Korean'].map((f, i) => (
            <div key={f} style={{
              padding: '5px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
              background: i === 0 ? 'rgba(200,167,107,0.12)' : '#1a1a24',
              border: `1px solid ${i === 0 ? 'rgba(200,167,107,0.3)' : 'rgba(255,255,255,0.06)'}`,
              color: i === 0 ? '#c8a76b' : '#928ea0',
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* This week */}
        {thisWeek.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '14px' }}>
              This week
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '10px' }}>
              {thisWeek.map((film: any) => {
                const poster = tmdbImage.poster(film.poster_path, 'w342')
                return (
                  <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                    }}>
                      <div style={{ aspectRatio: '2/3', background: '#1a1a24', position: 'relative', overflow: 'hidden' }}>
                        {poster
                          ? <img src={poster} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎬</div>
                        }
                        <div style={{
                          position: 'absolute', top: '6px', left: '6px',
                          background: 'rgba(69,190,160,0.85)', color: '#fff',
                          fontSize: '9px', padding: '2px 6px', borderRadius: '20px',
                        }}>
                          In Theatres
                        </div>
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {film.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '3px' }}>{film.release_date}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '14px' }}>
              Coming soon
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '10px' }}>
              {upcoming.map((film: any) => {
                const poster = tmdbImage.poster(film.poster_path, 'w342')
                return (
                  <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px', overflow: 'hidden',
                    }}>
                      <div style={{ aspectRatio: '2/3', background: '#1a1a24', overflow: 'hidden', position: 'relative' }}>
                        {poster
                          ? <img src={poster} alt={film.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🎬</div>
                        }
                        <div style={{
                          position: 'absolute', top: '6px', left: '6px',
                          background: 'rgba(200,167,107,0.85)', color: '#0a0804',
                          fontSize: '9px', padding: '2px 6px', borderRadius: '20px', fontWeight: '500',
                        }}>
                          Upcoming
                        </div>
                      </div>
                      <div style={{ padding: '8px 10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {film.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '3px' }}>{film.release_date}</div>
                        <div style={{ marginTop: '6px' }}>
                          <Link href="/auth/signup" style={{
                            fontSize: '10px', color: '#c8a76b', textDecoration: 'none',
                            background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.25)',
                            padding: '2px 7px', borderRadius: '20px',
                          }}>
                            + Interested
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {thisWeek.length === 0 && upcoming.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>Schedule loading</div>
            <div style={{ fontSize: '13px', color: '#928ea0' }}>Add your TMDB API key to see releases</div>
          </div>
        )}
      </div>
    </div>
  )
}
