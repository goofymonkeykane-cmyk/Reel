import { getFilm, getSeries, getWatchProviders, tmdbImage } from '@/lib/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
  searchParams: { type?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  try {
    const type = searchParams.type || 'movie'
    const film = type === 'tv' ? await getSeries(parseInt(params.id)) : await getFilm(parseInt(params.id))
    return {
      title: film.title || film.name,
      description: film.overview?.slice(0, 160),
    }
  } catch {
    return { title: 'Film' }
  }
}

export default async function FilmPage({ params, searchParams }: Props) {
  const type = searchParams.type || 'movie'
  const id = parseInt(params.id)

  let film: any = null
  let providers: any = null

  try {
    film = type === 'tv' ? await getSeries(id) : await getFilm(id)
    providers = await getWatchProviders(id, type as 'movie' | 'tv', 'IN')
  } catch {
    return (
      <div style={{ minHeight: '100vh', background: '#08080d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#928ea0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <div style={{ fontSize: '18px', color: '#ede9e3', marginBottom: '8px' }}>Film not found</div>
          <Link href="/films" style={{ color: '#c8a76b', textDecoration: 'none' }}>Browse all films →</Link>
        </div>
      </div>
    )
  }

  const title = film.title || film.name
  const releaseYear = (film.release_date || film.first_air_date || '').split('-')[0]
  const posterUrl = tmdbImage.poster(film.poster_path, 'w500')
  const backdropUrl = tmdbImage.backdrop(film.backdrop_path, 'w1280')
  const rating = film.vote_average?.toFixed(1)
  const runtime = film.runtime || (film.episode_run_time?.[0])
  const genres = film.genres?.map((g: any) => g.name).join(' · ')
  const cast = film.credits?.cast?.slice(0, 12) || []
  const crew = film.credits?.crew?.filter((c: any) =>
    ['Director', 'Screenplay', 'Director of Photography', 'Original Music Composer', 'Producer'].includes(c.job)
  ).slice(0, 8) || []
  const trailer = film.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
  const streaming = providers?.flatrate || []
  const rent = providers?.rent || []
  const buy = providers?.buy || []
  const similar = (film.similar?.results || film.recommendations?.results || []).slice(0, 8)
  const isUpcoming = film.release_date && new Date(film.release_date) > new Date()

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '0 20px', height: '48px',
        background: 'rgba(15,15,22,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <Link href="/films" style={{ fontSize: '13px', color: '#928ea0', textDecoration: 'none' }}>← Films</Link>
        <div style={{ flex: 1 }} />
        <Link href="/auth/login" style={{ fontSize: '13px', color: '#928ea0', textDecoration: 'none' }}>Sign in</Link>
      </nav>

      {/* Hero with backdrop */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        {backdropUrl ? (
          <img src={backdropUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#080012,#001028)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #08080d 30%, rgba(8,8,13,0.4) 100%)' }} />

        {/* Film info overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', gap: '20px', alignItems: 'flex-end',
          padding: '24px', maxWidth: '1100px', margin: '0 auto',
        }}>
          {/* Poster */}
          <div style={{
            width: '120px', height: '180px', borderRadius: '10px',
            overflow: 'hidden', flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.11)',
            background: '#1a1a24',
          }}>
            {posterUrl ? (
              <img src={posterUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎬</div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingBottom: '4px' }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(22px,4vw,36px)', lineHeight: '1.1', marginBottom: '6px' }}>
              {title}
            </h1>
            <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '8px' }}>
              {[releaseYear, runtime && `${runtime} min`, film.original_language?.toUpperCase()].filter(Boolean).join(' · ')}
            </div>
            {genres && (
              <div style={{ fontSize: '12px', color: '#928ea0', marginBottom: '10px' }}>{genres}</div>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              {rating && (
                <>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{
                        width: '11px', height: '11px',
                        background: i <= Math.round(film.vote_average / 2) ? '#c8a76b' : 'rgba(255,255,255,0.1)',
                        clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: '500', color: '#c8a76b' }}>{rating}</span>
                  <span style={{ fontSize: '11px', color: '#4d4a58' }}>{film.vote_count?.toLocaleString()} ratings</span>
                </>
              )}
              {isUpcoming && (
                <span style={{
                  fontSize: '11px', color: '#e05050',
                  background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.25)',
                  padding: '2px 8px', borderRadius: '20px',
                }}>
                  Upcoming · {film.release_date}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{
                padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
                textDecoration: 'none',
              }}>
                + Log film
              </Link>
              <Link href="/auth/signup" style={{
                padding: '8px 18px', borderRadius: '20px', fontSize: '12px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.11)',
                color: '#928ea0', textDecoration: 'none',
              }}>
                Watchlist
              </Link>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '12px',
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.11)',
                  color: '#928ea0', textDecoration: 'none',
                }}>
                  ▶ Trailer
                </a>
              )}
              {isUpcoming && (
                <Link href="/auth/signup" style={{
                  padding: '8px 18px', borderRadius: '20px', fontSize: '12px',
                  background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.25)',
                  color: '#e05050', textDecoration: 'none',
                }}>
                  Interested
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>

        {/* Left */}
        <div>
          {/* Overview */}
          {film.overview && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>Overview</div>
              <p style={{ fontSize: '14px', color: '#928ea0', lineHeight: '1.75' }}>{film.overview}</p>
            </div>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>Cast</div>
                <span style={{ fontSize: '11px', color: '#c8a76b', cursor: 'pointer' }}>Full cast →</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {cast.map((person: any) => (
                  <Link key={person.id} href={`/person/${person.id}`} style={{ flexShrink: 0, width: '80px', textAlign: 'center', textDecoration: 'none' }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '50%',
                      margin: '0 auto 6px',
                      background: '#1a1a24', overflow: 'hidden',
                      border: '2px solid rgba(255,255,255,0.06)',
                    }}>
                      {person.profile_path ? (
                        <img
                          src={tmdbImage.profile(person.profile_path, 'w185') || ''}
                          alt={person.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#928ea0' }}>
                          {person.name[0]}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '500', color: '#ede9e3', lineHeight: '1.3' }}>{person.name}</div>
                    <div style={{ fontSize: '9px', color: '#4d4a58', marginTop: '1px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{person.character}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Crew */}
          {crew.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '12px' }}>Crew</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {crew.map((person: any, i: number) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <div>
                      <Link href={`/person/${person.id}`} style={{ fontSize: '13px', fontWeight: '500', color: '#ede9e3', textDecoration: 'none' }}>
                        {person.name}
                      </Link>
                      <div style={{ fontSize: '11px', color: '#4d4a58' }}>{person.job}</div>
                    </div>
                    <Link href={`/person/${person.id}`} style={{
                      fontSize: '11px', color: '#7b69ee',
                      border: '1px solid rgba(123,105,238,0.25)',
                      padding: '3px 9px', borderRadius: '20px',
                      background: 'rgba(123,105,238,0.06)',
                      textDecoration: 'none',
                    }}>
                      All films →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Films */}
          {similar.length > 0 && (
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '12px' }}>You might also like</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: '8px' }}>
                {similar.map((s: any) => (
                  <Link key={s.id} href={`/films/${s.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ borderRadius: '7px', overflow: 'hidden', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
                      <div style={{ aspectRatio: '2/3', overflow: 'hidden', background: '#20202e' }}>
                        {s.poster_path ? (
                          <img src={tmdbImage.poster(s.poster_path, 'w185') || ''} alt={s.title || s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🎬</div>
                        )}
                      </div>
                      <div style={{ padding: '6px 8px' }}>
                        <div style={{ fontSize: '10px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {s.title || s.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div>

          {/* Where to watch */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
              Where to watch · India
            </div>

            {streaming.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#4d4a58', marginBottom: '6px' }}>Stream</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {streaming.map((p: any) => (
                    <div key={p.provider_id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', background: '#1a1a24',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px', cursor: 'pointer',
                    }}>
                      {p.logo_path && (
                        <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} style={{ width: '24px', height: '24px', borderRadius: '5px' }} />
                      )}
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#ede9e3' }}>{p.provider_name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#45bea0' }}>Included</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rent.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#4d4a58', marginBottom: '6px' }}>Rent</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {rent.slice(0, 3).map((p: any) => (
                    <div key={p.provider_id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', background: '#1a1a24',
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
                    }}>
                      {p.logo_path && (
                        <img src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} style={{ width: '24px', height: '24px', borderRadius: '5px' }} />
                      )}
                      <span style={{ fontSize: '13px', color: '#ede9e3' }}>{p.provider_name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#928ea0' }}>Rent</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {streaming.length === 0 && rent.length === 0 && (
              <div style={{
                padding: '12px', background: 'rgba(224,80,80,0.06)',
                border: '1px solid rgba(224,80,80,0.15)', borderRadius: '8px',
                fontSize: '12px', color: '#928ea0', textAlign: 'center',
              }}>
                {isUpcoming ? 'Not yet released' : 'Not available for streaming in India'}
              </div>
            )}
          </div>

          {/* Book cinema tickets */}
          {isUpcoming || (!isUpcoming && new Date(film.release_date || '') > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) ? (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
                Cinema tickets
              </div>
              <a
                href={`https://in.bookmyshow.com/search?q=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', padding: '12px',
                  background: 'rgba(200,167,107,0.08)', border: '1px solid rgba(200,167,107,0.2)',
                  borderRadius: '10px', textDecoration: 'none', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#c8a76b' }}>Book on BookMyShow</div>
                <div style={{ fontSize: '11px', color: '#928ea0', marginTop: '2px' }}>Compare lowest prices →</div>
              </a>
            </div>
          ) : null}

          {/* Lock in cast */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>
              Lock in
            </div>
            <Link href="/auth/signup" style={{
              display: 'block', padding: '12px',
              background: 'rgba(69,190,160,0.06)', border: '1px solid rgba(69,190,160,0.2)',
              borderRadius: '10px', textDecoration: 'none', textAlign: 'center',
            }}>
              <div style={{ fontSize: '13px', color: '#45bea0' }}>🔒 Follow cast & crew</div>
              <div style={{ fontSize: '11px', color: '#928ea0', marginTop: '2px' }}>Get notified on new projects</div>
            </Link>
          </div>

          {/* Film details */}
          <div style={{ background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>Details</div>
            {[
              { label: 'Status', value: film.status },
              { label: 'Release', value: film.release_date || film.first_air_date },
              { label: 'Language', value: film.original_language?.toUpperCase() },
              { label: 'Budget', value: film.budget ? `$${(film.budget / 1000000).toFixed(0)}M` : null },
              { label: 'Revenue', value: film.revenue ? `$${(film.revenue / 1000000).toFixed(0)}M` : null },
              { label: 'Seasons', value: film.number_of_seasons },
              { label: 'Episodes', value: film.number_of_episodes },
            ].filter(d => d.value).map((d, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '12px',
              }}>
                <span style={{ color: '#4d4a58' }}>{d.label}</span>
                <span style={{ color: '#928ea0' }}>{d.value}</span>
              </div>
            ))}
          </div>

          {/* TMDB attribution */}
          <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '10px', color: '#4d4a58' }}>
            Film data from{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" style={{ color: '#928ea0', textDecoration: 'none' }}>
              TMDB
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
