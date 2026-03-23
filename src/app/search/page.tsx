'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/films/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 20px', height: '48px',
        background: 'rgba(15,15,22,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '28px', marginBottom: '20px' }}>
          Search
        </h1>

        {/* Search input */}
        <input
          autoFocus
          type="text"
          placeholder="Search films, series, anime, people..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%', padding: '14px 18px',
            background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: '12px', fontSize: '15px', color: '#ede9e3',
            outline: 'none', fontFamily: 'DM Sans, sans-serif',
            marginBottom: '20px',
          }}
        />

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#928ea0', fontSize: '14px' }}>
            Searching...
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {results.map((item: any) => {
              const isTV = item.media_type === 'tv'
              const isPerson = item.media_type === 'person'
              const title = item.title || item.name
              const year = (item.release_date || item.first_air_date || '').split('-')[0]
              const href = isPerson ? `/person/${item.id}` : `/films/${item.id}${isTV ? '?type=tv' : ''}`
              const poster = item.poster_path
                ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
                : item.profile_path
                ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                : null

              return (
                <Link key={`${item.media_type}-${item.id}`} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Poster/photo */}
                    <div style={{
                      width: isPerson ? '40px' : '32px',
                      height: isPerson ? '40px' : '46px',
                      borderRadius: isPerson ? '50%' : '5px',
                      flexShrink: 0, background: '#1a1a24',
                      overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {poster ? (
                        <img src={poster} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                          {isPerson ? '👤' : '🎬'}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#ede9e3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4d4a58', marginTop: '2px' }}>
                        {isPerson
                          ? item.known_for_department
                          : [isTV ? 'TV Series' : 'Film', year].filter(Boolean).join(' · ')
                        }
                      </div>
                    </div>

                    {/* Rating */}
                    {item.vote_average > 0 && (
                      <div style={{ fontSize: '12px', color: '#c8a76b', fontWeight: '500', flexShrink: 0 }}>
                        {item.vote_average.toFixed(1)} ★
                      </div>
                    )}

                    {/* Type badge */}
                    <div style={{
                      fontSize: '9px', padding: '2px 7px', borderRadius: '20px', flexShrink: 0,
                      background: isPerson ? 'rgba(91,156,246,0.1)' : isTV ? 'rgba(123,105,238,0.1)' : 'rgba(200,167,107,0.1)',
                      border: `1px solid ${isPerson ? 'rgba(91,156,246,0.25)' : isTV ? 'rgba(123,105,238,0.25)' : 'rgba(200,167,107,0.25)'}`,
                      color: isPerson ? '#5b9cf6' : isTV ? '#a99af5' : '#c8a76b',
                    }}>
                      {isPerson ? 'Person' : isTV ? 'Series' : 'Film'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {query.length >= 2 && results.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#928ea0' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
            <div>No results for "{query}"</div>
          </div>
        )}

        {/* Default state */}
        {query.length < 2 && !loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: '#4d4a58' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎬</div>
            <div style={{ fontSize: '14px' }}>Search 800,000+ films, series, anime and people</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
              {['Dune', 'One Piece', 'Gangs of Wasseypur', 'Denis Villeneuve'].map(s => (
                <button key={s} onClick={() => setQuery(s)} style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px',
                  background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)',
                  color: '#928ea0', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
