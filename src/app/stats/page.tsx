import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StatsPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: logs } = await supabase.from('film_logs').select('*').eq('user_id', user.id)
  const { data: logsWithRating } = await supabase.from('film_logs').select('rating').eq('user_id', user.id).not('rating', 'is', null)
  const { data: reviews } = await supabase.from('film_logs').select('id').eq('user_id', user.id).not('review', 'is', null)

  const totalFilms = logs?.length || 0
  const totalRatings = logsWithRating?.length || 0
  const totalReviews = reviews?.length || 0
  const avgRating = logsWithRating && logsWithRating.length > 0
    ? (logsWithRating.reduce((sum, l) => sum + (l.rating || 0), 0) / logsWithRating.length).toFixed(1)
    : '—'

  const ratingDist = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].map(r => ({
    r, count: logsWithRating?.filter(l => l.rating === r).length || 0,
  }))
  const maxCount = Math.max(...ratingDist.map(d => d.count), 1)

  const currentYear = new Date().getFullYear()
  const thisYearLogs = logs?.filter(l => l.watched_date?.startsWith(String(currentYear))) || []

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>My Statistics</span>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Year header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '72px', letterSpacing: '-4px', lineHeight: '1' }}>
            {currentYear}
          </div>
          <div style={{ fontSize: '13px', color: '#928ea0', marginTop: '6px' }}>
            {profile?.display_name || profile?.username}'s year in cinema
          </div>
        </div>

        {/* Key stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '28px' }}>
          {[
            { n: thisYearLogs.length, l: 'Films this year' },
            { n: totalFilms, l: 'All time films' },
            { n: totalReviews, l: 'Reviews written' },
            { n: avgRating, l: 'Average rating' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', padding: '16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', fontWeight: '500', color: '#ede9e3' }}>{s.n}</div>
              <div style={{ fontSize: '10px', color: '#4d4a58', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '3px' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Ratings distribution */}
        {totalRatings > 0 && (
          <div style={{
            background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px', padding: '20px', marginBottom: '20px',
          }}>
            <div style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '14px' }}>
              Rating distribution · {totalRatings} ratings
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '80px', marginBottom: '6px' }}>
              {ratingDist.map(d => (
                <div key={d.r} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <div style={{
                    width: '100%', background: '#45bea0', borderRadius: '2px 2px 0 0',
                    height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0',
                    opacity: 0.8,
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#4d4a58' }}>
              <span>½★</span><span>★★</span><span>★★★</span><span>★★★★</span><span>★★★★★</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {totalFilms === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>No stats yet</div>
            <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '20px' }}>Start logging films to see your statistics</div>
            <Link href="/search" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '13px', background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none' }}>
              Log your first film →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
