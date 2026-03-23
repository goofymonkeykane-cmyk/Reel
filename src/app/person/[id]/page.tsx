import { getPerson, tmdbImage } from '@/lib/tmdb'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const person = await getPerson(parseInt(params.id))
    return { title: person.name }
  } catch {
    return { title: 'Person' }
  }
}

export default async function PersonPage({ params }: Props) {
  let person: any = null

  try {
    person = await getPerson(parseInt(params.id))
  } catch {
    return (
      <div style={{ minHeight: '100vh', background: '#08080d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#928ea0' }}>Person not found</div>
      </div>
    )
  }

  const photoUrl = tmdbImage.profile(person.profile_path, 'w185')
  const filmography = person.combined_credits?.cast
    ?.sort((a: any, b: any) => (b.release_date || b.first_air_date || '').localeCompare(a.release_date || a.first_air_date || ''))
    ?.slice(0, 20) || []

  const departments = [...new Set(person.combined_credits?.crew?.map((c: any) => c.department) || [])]

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 20px', height: '48px',
        background: 'rgba(15,15,22,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <Link href="/films" style={{ fontSize: '13px', color: '#928ea0', textDecoration: 'none' }}>← Back</Link>
      </nav>

      {/* Person hero */}
      <div style={{ background: '#0f0f16', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {/* Photo */}
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', flexShrink: 0,
            overflow: 'hidden', background: '#1a1a24',
            border: '3px solid rgba(255,255,255,0.06)',
          }}>
            {photoUrl ? (
              <img src={photoUrl} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#928ea0' }}>
                {person.name?.[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '4px' }}>
              {person.name}
            </h1>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.25)',
              color: '#c8a76b', fontSize: '11px', padding: '2px 10px', borderRadius: '20px', marginBottom: '10px',
            }}>
              {person.known_for_department}
            </div>

            {person.biography && (
              <p style={{ fontSize: '13px', color: '#928ea0', lineHeight: '1.65', marginBottom: '12px', maxWidth: '500px' }}>
                {person.biography.slice(0, 250)}{person.biography.length > 250 ? '...' : ''}
              </p>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
              {[
                { n: filmography.length, l: 'Films' },
                { n: person.popularity?.toFixed(0), l: 'Popularity' },
                { n: person.birthday?.split('-')[0] || '—', l: 'Born' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#ede9e3' }}>{s.n}</div>
                  <div style={{ fontSize: '9px', color: '#4d4a58', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Lock-in CTA */}
            <Link href="/auth/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
              background: 'rgba(69,190,160,0.1)', border: '1px solid rgba(69,190,160,0.3)',
              color: '#45bea0', textDecoration: 'none',
            }}>
              🔒 Lock in · Get notified on new projects
            </Link>
          </div>
        </div>

        {/* Lock-in info box */}
        <div style={{
          marginTop: '16px',
          background: 'linear-gradient(135deg,rgba(200,167,107,0.06),rgba(123,105,238,0.04))',
          border: '1px solid rgba(200,167,107,0.15)',
          borderRadius: '10px', padding: '14px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#c8a76b', marginBottom: '8px' }}>
            🔒 Lock-in notifications — what you can get
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[
              'New film announced',
              'Trailer released',
              'Now in theatres',
              'Now streaming',
              'Awards nominated',
            ].map(n => (
              <div key={n} style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', color: '#928ea0',
              }}>
                {n}
              </div>
            ))}
          </div>
          <Link href="/auth/signup" style={{ display: 'block', marginTop: '10px', fontSize: '12px', color: '#7b69ee', textDecoration: 'none' }}>
            Sign up to lock in →
          </Link>
        </div>
      </div>

      {/* Filmography */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>
            Filmography · {filmography.length} titles
          </div>
          {departments.length > 0 && (
            <div style={{ fontSize: '11px', color: '#928ea0' }}>
              Also: {departments.join(' · ')}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {filmography.map((film: any, i: number) => {
            const isTV = film.media_type === 'tv'
            const title = film.title || film.name
            const year = (film.release_date || film.first_air_date || '').split('-')[0]
            const poster = tmdbImage.poster(film.poster_path, 'w185')
            const rating = film.vote_average?.toFixed(1)

            return (
              <Link
                key={`${film.id}-${i}`}
                href={`/films/${film.id}${isTV ? '?type=tv' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', gap: '12px', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    const titleEl = e.currentTarget.querySelector('.film-title') as HTMLElement
                    if (titleEl) titleEl.style.color = '#c8a76b'
                  }}
                  onMouseLeave={e => {
                    const titleEl = e.currentTarget.querySelector('.film-title') as HTMLElement
                    if (titleEl) titleEl.style.color = '#ede9e3'
                  }}
                >
                  {/* Mini poster */}
                  <div style={{
                    width: '34px', height: '48px', borderRadius: '4px', flexShrink: 0,
                    background: '#1a1a24', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {poster ? (
                      <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎬</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="film-title" style={{ fontSize: '13px', fontWeight: '500', color: '#ede9e3', transition: 'color 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '2px' }}>
                      {[year, film.character, isTV ? 'TV Series' : ''].filter(Boolean).join(' · ')}
                    </div>
                  </div>

                  {/* Rating */}
                  {rating && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '12px', color: '#c8a76b', fontWeight: '500' }}>{rating} ★</div>
                      <div style={{ fontSize: '9px', color: '#4d4a58' }}>{year}</div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
