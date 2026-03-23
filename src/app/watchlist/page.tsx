import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function WatchlistPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: watchlist } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Watchlist</span>
      </nav>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '20px' }}>
          My Watchlist · <span style={{ color: '#c8a76b' }}>{watchlist?.length || 0} films</span>
        </div>
        {watchlist && watchlist.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: '10px' }}>
            {watchlist.map((item: any) => (
              <Link key={item.id} href={`/films/${item.film_id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '2/3', background: '#1a1a24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.film_poster
                      ? <img src={`https://image.tmdb.org/t/p/w342${item.film_poster}`} alt={item.film_title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '28px' }}>🎬</span>
                    }
                  </div>
                  <div style={{ padding: '7px 8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '500', color: '#ede9e3', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {item.film_title}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>Your watchlist is empty</div>
            <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '20px' }}>Browse films and click Watchlist to save them for later</div>
            <Link href="/films" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '13px', background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none' }}>
              Browse films →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
