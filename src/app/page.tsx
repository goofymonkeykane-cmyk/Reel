import Link from 'next/link'
import { getTrending, getUpcoming } from '@/lib/tmdb'

export default async function HomePage() {
  // Fetch trending films for background display
  let trending = []
  let upcoming = []
  try {
    const trendingData = await getTrending('week')
    trending = trendingData.results?.slice(0, 10) || []
    const upcomingData = await getUpcoming(1, 'IN')
    upcoming = upcomingData.results?.slice(0, 6) || []
  } catch (e) {
    // API might not be configured yet during development
  }

  return (
    <main style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Navigation */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: '52px',
        background: 'rgba(15,15,22,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c8a76b' }} />
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: '20px' }}>reel</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/auth/login" style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
            border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0',
            textDecoration: 'none', fontWeight: '500',
          }}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
            background: '#c8a76b', border: '1px solid #c8a76b',
            color: '#0a0804', textDecoration: 'none', fontWeight: '500',
          }}>
            Join free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(123,105,238,0.1)', border: '1px solid rgba(123,105,238,0.25)',
          padding: '4px 12px', borderRadius: '20px',
          fontSize: '12px', color: '#a99af5', marginBottom: '24px',
        }}>
          <span>Open source · Free forever · No ads</span>
        </div>

        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 'clamp(36px, 6vw, 64px)',
          lineHeight: '1.1',
          letterSpacing: '-1px',
          marginBottom: '20px',
        }}>
          Cinema is better<br />
          <span style={{ color: '#c8a76b' }}>with your people</span>
        </h1>

        <p style={{
          fontSize: '16px', color: '#928ea0', lineHeight: '1.7',
          marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px',
        }}>
          Find cinephiles who love what you love. Log films, match by taste,
          message, watch together. Free forever — like VLC, like Wikipedia,
          like cinema itself.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{
            padding: '12px 28px', borderRadius: '25px', fontSize: '15px',
            background: '#c8a76b', border: '1px solid #c8a76b',
            color: '#0a0804', textDecoration: 'none', fontWeight: '500',
          }}>
            Start for free
          </Link>
          <Link href="/films" style={{
            padding: '12px 28px', borderRadius: '25px', fontSize: '15px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.11)',
            color: '#928ea0', textDecoration: 'none', fontWeight: '500',
          }}>
            Browse films
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: '0', justifyContent: 'center',
          marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '30px',
        }}>
          {[
            { n: '800K+', l: 'Films & Series' },
            { n: '100%', l: 'Free forever' },
            { n: '0', l: 'Advertisements' },
            { n: 'AGPL', l: 'Open source' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              padding: '0 16px',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '500', color: '#ede9e3' }}>
                {stat.n}
              </div>
              <div style={{ fontSize: '11px', color: '#4d4a58', marginTop: '2px' }}>
                {stat.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '0 24px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {[
          {
            icon: '🎯',
            title: 'Taste-based matching',
            desc: 'Find cinephiles who rate the same films the same way. A 94% match means you are basically the same person but have not met yet.',
          },
          {
            icon: '💬',
            title: 'Real cinema DMs',
            desc: 'Message cinephiles, share film cards with ratings, share watchlists, plan watch parties — all inside one conversation.',
          },
          {
            icon: '🎬',
            title: 'Legal watch parties',
            desc: 'Everyone logs into their own Netflix, Prime, or YouTube. Reel syncs the playback. You watch together, legally.',
          },
          {
            icon: '🌍',
            title: 'Every film ever made',
            desc: 'Films, series, anime, documentaries from every country and language. Bollywood, South Indian, Korean, Japanese, European — all here.',
          },
          {
            icon: '🔒',
            title: 'Lock in on anyone',
            desc: 'Follow any actor, director, or composer. Get notified the moment they announce a new project, drop a trailer, or hit theatres.',
          },
          {
            icon: '🎟️',
            title: 'Book cinema tickets',
            desc: 'Find the lowest ticket price across BookMyShow, Paytm Movies, and others. See which friends are going. Plan together.',
          },
          {
            icon: '📊',
            title: 'Deep statistics',
            desc: 'World map of films by country. Crew breakdowns. Nanogenres. Year in review you can share. Better than anything behind a paywall.',
          },
          {
            icon: '🏛️',
            title: 'Community clubs',
            desc: 'Marvel, DC, Indian Cinema, Anime, K-Drama, World Cinema, Film-Making. Post, discuss, connect — without the noise of Twitter.',
          },
          {
            icon: '❤️',
            title: 'Free. Always.',
            desc: 'No ads. No paywalls. No premium tiers. Sustained by voluntary donations like Wikipedia. Built like VLC. Licensed like Linux.',
          },
        ].map((f, i) => (
          <div key={i} style={{
            background: '#0f0f16',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '20px',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: '500', color: '#ede9e3', marginBottom: '8px' }}>
              {f.title}
            </div>
            <div style={{ fontSize: '13px', color: '#928ea0', lineHeight: '1.6' }}>
              {f.desc}
            </div>
          </div>
        ))}
      </section>

      {/* Upcoming Films Section */}
      {upcoming.length > 0 && (
        <section style={{
          maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58' }}>
              Coming soon · India
            </div>
            <Link href="/schedule" style={{ fontSize: '12px', color: '#c8a76b', textDecoration: 'none' }}>
              Full schedule →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '10px',
          }}>
            {upcoming.map((film: any) => (
              <Link key={film.id} href={`/films/${film.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                }}>
                  <div style={{
                    aspectRatio: '2/3', background: '#1a1a24',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px', overflow: 'hidden',
                  }}>
                    {film.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
                        alt={film.title || film.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : '🎬'}
                  </div>
                  <div style={{ padding: '8px' }}>
                    <div style={{
                      fontSize: '11px', fontWeight: '500', color: '#ede9e3',
                      overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {film.title || film.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#4d4a58', marginTop: '2px' }}>
                      {film.release_date?.split('-')[0]}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Open Source Banner */}
      <section style={{
        background: 'rgba(123,105,238,0.06)',
        borderTop: '1px solid rgba(123,105,238,0.15)',
        borderBottom: '1px solid rgba(123,105,238,0.15)',
        padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', marginBottom: '12px' }}>
            Built for cinema lovers, by cinema lovers
          </div>
          <p style={{ fontSize: '14px', color: '#928ea0', lineHeight: '1.7', marginBottom: '20px' }}>
            Reel is open source under AGPL-3.0. Every line of code is public.
            Every rupee of funding is disclosed. No corporation owns this.
            No investor can change this. The community owns Reel — forever.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/yourusername/reel"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 18px', borderRadius: '20px', fontSize: '12px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.11)',
                color: '#928ea0', textDecoration: 'none',
              }}
            >
              View on GitHub
            </a>
            <Link href="/donate" style={{
              padding: '8px 18px', borderRadius: '20px', fontSize: '12px',
              background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.25)',
              color: '#c8a76b', textDecoration: 'none',
            }}>
              Support Reel voluntarily
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', marginBottom: '8px' }}>
          reel
        </div>
        <p style={{ fontSize: '12px', color: '#4d4a58', marginBottom: '16px' }}>
          Free. Open source. Forever. · AGPL-3.0 License
        </p>
        <p style={{ fontSize: '11px', color: '#4d4a58' }}>
          Film data provided by{' '}
          <a href="https://www.themoviedb.org" style={{ color: '#928ea0', textDecoration: 'none' }}>
            TMDB
          </a>
          {' '}· Built with Next.js, Supabase, and love for cinema
        </p>
      </footer>
    </main>
  )
}
