import { createServerClientInstance } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// ============ LISTS PAGE ============
export default async function ListsPage() {
  const supabase = createServerClientInstance()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: lists } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>My Lists</span>
        <div style={{ flex: 1 }} />
        <button style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '12px', background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          + New list
        </button>
      </nav>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '20px' }}>My Lists</div>
        {lists && lists.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '12px' }}>
            {lists.map((list: any) => (
              <div key={list.id} style={{ background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#ede9e3', marginBottom: '6px' }}>{list.title}</div>
                {list.description && <div style={{ fontSize: '12px', color: '#928ea0', marginBottom: '10px' }}>{list.description}</div>}
                <div style={{ fontSize: '11px', color: '#4d4a58' }}>{list.films_count} films · {list.is_public ? 'Public' : 'Private'}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', background: '#0f0f16', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📝</div>
            <div style={{ fontSize: '16px', color: '#ede9e3', marginBottom: '8px' }}>No lists yet</div>
            <div style={{ fontSize: '13px', color: '#928ea0' }}>Create curated lists of your favourite films and share them with the community</div>
          </div>
        )}
      </div>
    </div>
  )
}
