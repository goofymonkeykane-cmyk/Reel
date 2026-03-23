import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support Reel',
  description: 'Reel is free forever. If it matters to you, consider a voluntary donation.',
}

export default function DonatePage() {
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

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>

        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '36px', marginBottom: '16px' }}>
          Reel is free.<br />
          <span style={{ color: '#c8a76b' }}>It will always be free.</span>
        </div>

        <p style={{ fontSize: '15px', color: '#928ea0', lineHeight: '1.8', marginBottom: '32px' }}>
          Reel has no investors. No advertisers. No premium tier.
          It is sustained entirely by people who believe cinema culture
          deserves a platform that serves them — not one that extracts from them.
          If Reel has been valuable to you, please consider a voluntary contribution.
          It keeps the servers running and the community free.
        </p>

        {/* Funding transparency */}
        <div style={{
          background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '14px' }}>
            Monthly transparency report
          </div>
          {[
            { label: 'Server costs (Supabase + Vercel)', value: '~$40/mo' },
            { label: 'Media storage (Cloudinary)', value: '~$10/mo' },
            { label: 'Total monthly cost', value: '~$50/mo', highlight: true },
            { label: 'Donations this month', value: '$0', green: true },
            { label: 'Shortfall', value: '$50', red: true },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              fontSize: '13px',
            }}>
              <span style={{ color: row.highlight ? '#ede9e3' : '#928ea0', fontWeight: row.highlight ? '500' : '400' }}>
                {row.label}
              </span>
              <span style={{
                fontWeight: '500',
                color: row.green ? '#45bea0' : row.red ? '#e05050' : row.highlight ? '#ede9e3' : '#928ea0',
              }}>
                {row.value}
              </span>
            </div>
          ))}
          <div style={{ fontSize: '11px', color: '#4d4a58', marginTop: '10px' }}>
            This report updates on the 1st of every month. Every rupee is accounted for.
          </div>
        </div>

        {/* Donation amounts */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: '#928ea0', marginBottom: '14px' }}>
            Choose any amount — or enter your own
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            {['₹50', '₹100', '₹200', '₹500', '₹1000', 'Custom'].map((amount) => (
              <div key={amount} style={{
                padding: '12px', background: '#1a1a24',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
                cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#ede9e3',
                textAlign: 'center',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,167,107,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                {amount}
              </div>
            ))}
          </div>
        </div>

        {/* UPI donation */}
        <div style={{
          background: 'rgba(200,167,107,0.06)', border: '1px solid rgba(200,167,107,0.2)',
          borderRadius: '12px', padding: '20px', marginBottom: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#c8a76b', marginBottom: '8px', fontWeight: '500' }}>Donate via UPI (India)</div>
          <div style={{ fontSize: '16px', color: '#ede9e3', fontFamily: 'monospace', background: '#1a1a24', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
            reel@upi
          </div>
          <div style={{ fontSize: '11px', color: '#4d4a58' }}>
            All UPI apps supported — Google Pay, PhonePe, Paytm, BHIM
          </div>
        </div>

        {/* What your donation does */}
        <div style={{
          background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '12px' }}>
            What your contribution does
          </div>
          {[
            { amount: '₹50', desc: 'Keeps Reel alive for one more user for a month' },
            { amount: '₹200', desc: 'Pays for a day of server costs for the whole community' },
            { amount: '₹500', desc: 'Covers a week of infrastructure for thousands of cinephiles' },
            { amount: '₹1,000', desc: 'Two weeks of a completely free, ad-free cinema platform' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: '500', color: '#c8a76b',
                background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)',
                padding: '2px 8px', borderRadius: '20px', flexShrink: 0, marginTop: '1px',
              }}>
                {item.amount}
              </div>
              <div style={{ fontSize: '13px', color: '#928ea0', lineHeight: '1.5' }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* No pressure message */}
        <div style={{ fontSize: '13px', color: '#4d4a58', lineHeight: '1.7', marginBottom: '24px' }}>
          There is no premium version. There is no badge or benefit for donating.
          You get exactly the same Reel whether you donate ₹0 or ₹10,000.
          This is exactly how it should be.
        </div>

        {/* Philosophy */}
        <div style={{
          background: 'rgba(123,105,238,0.06)', border: '1px solid rgba(123,105,238,0.15)',
          borderRadius: '12px', padding: '20px',
        }}>
          <div style={{ fontSize: '13px', color: '#a99af5', lineHeight: '1.7', fontStyle: 'italic' }}>
            "Wikipedia doesn't put articles behind paywalls. VLC doesn't lock
            codec support to paid users. Linux doesn't charge for the enterprise kernel.
            Reel doesn't charge for cinema. These are all the same idea:
            some things are too important to be owned by anyone."
          </div>
          <div style={{ fontSize: '11px', color: '#4d4a58', marginTop: '8px' }}>— Reel philosophy</div>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Link href="/" style={{ fontSize: '13px', color: '#928ea0', textDecoration: 'none' }}>
            ← Back to Reel
          </Link>
        </div>
      </div>
    </div>
  )
}
