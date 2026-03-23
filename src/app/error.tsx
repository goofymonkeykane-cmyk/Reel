'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh', background: '#08080d', color: '#ede9e3',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', textAlign: 'center', padding: '24px',
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', marginBottom: '10px' }}>
        Something went wrong
      </div>
      <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '24px', maxWidth: '400px', lineHeight: '1.6' }}>
        An unexpected error occurred. This has been noted.
        If the problem persists, please open an issue on GitHub.
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={reset} style={{
          padding: '9px 20px', borderRadius: '20px', fontSize: '13px',
          background: '#c8a76b', border: '1px solid #c8a76b', color: '#0a0804',
          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
        }}>
          Try again
        </button>
        <a href="/" style={{
          padding: '9px 20px', borderRadius: '20px', fontSize: '13px',
          background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0',
          textDecoration: 'none',
        }}>
          Go home
        </a>
      </div>
    </div>
  )
}
