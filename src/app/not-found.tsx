import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#08080d', color: '#ede9e3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: '24px',
    }}>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '80px', color: '#1a1a24', marginBottom: '0', lineHeight: '1' }}>404</div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', marginBottom: '12px' }}>
        This scene was cut
      </div>
      <div style={{ fontSize: '14px', color: '#928ea0', marginBottom: '28px', maxWidth: '300px', lineHeight: '1.6' }}>
        The page you are looking for does not exist or was removed.
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Link href="/" style={{
          padding: '9px 20px', borderRadius: '20px', fontSize: '13px',
          background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804', textDecoration: 'none',
        }}>
          Go home
        </Link>
        <Link href="/films" style={{
          padding: '9px 20px', borderRadius: '20px', fontSize: '13px',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0', textDecoration: 'none',
        }}>
          Browse films
        </Link>
      </div>
    </div>
  )
}
