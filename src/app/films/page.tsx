import { getTrending, getPopularFilms, getAnime, getBollywood, getUpcoming, tmdbImage } from '@/lib/tmdb'
import Link from 'next/link'

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category || 'trending'

  let films: any[] = []
  let pageTitle = 'Trending'

  try {
    if (category === 'trending') {
      const data = await getTrending('week')
      films = data.results || []
      pageTitle = 'Trending this week'
    } else if (category === 'popular') {
      const data = await getPopularFilms()
      films = data.results || []
      pageTitle = 'Popular films'
    } else if (category === 'bollywood') {
      const data = await getBollywood()
      films = data.results || []
      pageTitle = 'Bollywood'
    } else if (category === 'anime') {
      const data = await getAnime()
      films = data.results || []
      pageTitle = 'Anime'
    } else if (category === 'upcoming') {
      const data = await getUpcoming(1, 'IN')
      films = data.results || []
      pageTitle = 'Upcoming in India'
    }
  } catch (e) {
    films = []
  }

  const categories = [
    { key: 'trending', label: 'Trending' },
    { key: 'popular', label: 'Popular' },
    { key: 'bollywood', label: 'Bollywood' },
    { key: 'anime', label: 'Anime' },
    { key: 'upcoming', label: 'Upcoming' },
  ]

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
        <div style={{ flex: 1 }} />
        <Link href="/search" style={{ fontSize: '13px', color: '#928ea0', textDecoration: 'none' }}>Search</Link>
        <Link href="/auth/signup" style={{
          padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
          background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
        }}>
          Join free
        </Link>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '28px', marginBottom: '20px' }}>
          {pageTitle}
        </h1>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <Link
              key={cat.key}
              href={`/films?category=${cat.key}`}
              style={{
                padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                textDecoration: 'none', fontWeight: '500',
                background: category === cat.key ? 'rgba(200,167,107,0.12)' : '#1a1a24',
                border: `1px solid ${category === cat.key ? 'rgba(200,167,107,0.3)' : 'rgba(255,255,255,0.06)'}`,
                color: category === cat.key ? '#c8a76b' : '#928ea0',
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Films grid */}
        {films.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
          }}>
            {films.map((film: any) => {
              const isTV = film.media_type === 'tv' || film.first_air_date
              const title = film.title || film.name
              const year = (film.release_date || film.first_air_date || '').split('-')[0]
              const poster = tmdbImage.poster(film.poster_path, 'w342')
              const rating = film.vote_average?.toFixed(1)

              return (
                <Link
                  key={film.id}
                  href={`/films/${film.id}${isTV ? '?type=tv' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.11)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
                  >
                    {/* Poster */}
                    <div style={{ aspectRatio: '2/3', overflow: 'hidden', background: '#1a1a24', position: 'relative' }}>
                      {poster ? (
                        <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎬</div>
                      )}
                      {isTV && (
                        <div style={{
                          position: 'absolute', top: '6px', left: '6px',
                          background: 'rgba(123,105,238,0.85)', color: '#fff',
                          fontSize: '9px', padding: '2px 6px', borderRadius: '20px',
                        }}>
                          TV
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '9px 10px' }}>
                      <div style={{
                        fontSize: '12px', fontWeight: '500', color: '#ede9e3',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4', marginBottom: '3px',
                      }}>
                        {title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '10px', color: '#4d4a58' }}>{year}</span>
                        {rating && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <div style={{
                              width: '8px', height: '8px', background: '#c8a76b',
                              clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                            }} />
                            <span style={{ fontSize: '10px', color: '#c8a76b', fontWeight: '500' }}>{rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#928ea0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎬</div>
            <div>Add your TMDB API key to see films</div>
            <div style={{ fontSize: '12px', marginTop: '6px', color: '#4d4a58' }}>
              Get a free key at themoviedb.org
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
