'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

const GENRES = ['Action', 'Drama', 'Thriller', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Documentary', 'Animation', 'Crime', 'Fantasy', 'Mystery', 'Adventure', 'Biography', 'Musical']
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Japanese', 'Korean', 'French', 'Spanish', 'Italian']
const MOODS = ['Slow cinema', 'Blockbusters', 'Art house', 'World cinema', 'Anime', 'Classic films', 'New releases', 'Indies', 'Documentaries', 'Series', 'K-Drama']

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState({
    genres: [] as string[],
    languages: [] as string[],
    moods: [] as string[],
    letterboxd: '',
  })

  const toggle = (key: 'genres' | 'languages' | 'moods', value: string) => {
    setSelected(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  const finish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      // Save letterboxd username if provided
      if (selected.letterboxd) {
        await supabase
          .from('profiles')
          .update({ letterboxd_username: selected.letterboxd })
          .eq('id', user.id)
      }

      toast.success('Welcome to Reel!')
      router.push('/home')
    } catch (e) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const chipStyle = (active: boolean) => ({
    padding: '8px 16px', borderRadius: '20px', fontSize: '13px',
    cursor: 'pointer', border: '1px solid',
    background: active ? 'rgba(200,167,107,0.12)' : '#1a1a24',
    borderColor: active ? 'rgba(200,167,107,0.4)' : 'rgba(255,255,255,0.06)',
    color: active ? '#c8a76b' : '#928ea0',
    transition: 'all 0.15s',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: '3px', borderRadius: '2px',
              background: s <= step ? '#c8a76b' : '#1a1a24',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '8px' }}>What genres do you love?</div>
            <div style={{ fontSize: '14px', color: '#928ea0', marginBottom: '24px' }}>Pick as many as you like. This builds your taste profile.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {GENRES.map(g => (
                <div key={g} style={chipStyle(selected.genres.includes(g))} onClick={() => toggle('genres', g)}>{g}</div>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={selected.genres.length === 0} style={{
              width: '100%', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
              background: selected.genres.length > 0 ? '#c8a76b' : '#1a1a24',
              border: 'none', color: selected.genres.length > 0 ? '#0a0804' : '#4d4a58',
              cursor: selected.genres.length > 0 ? 'pointer' : 'not-allowed',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '8px' }}>Languages and moods</div>
            <div style={{ fontSize: '14px', color: '#928ea0', marginBottom: '20px' }}>What languages and cinema moods do you enjoy?</div>

            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {LANGUAGES.map(l => (
                <div key={l} style={chipStyle(selected.languages.includes(l))} onClick={() => toggle('languages', l)}>{l}</div>
              ))}
            </div>

            <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '10px' }}>Cinema moods</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {MOODS.map(m => (
                <div key={m} style={chipStyle(selected.moods.includes(m))} onClick={() => toggle('moods', m)}>{m}</div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(1)} style={{
                padding: '13px 20px', borderRadius: '10px', fontSize: '14px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>← Back</button>
              <button onClick={() => setStep(3)} style={{
                flex: 1, padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                background: '#c8a76b', border: 'none', color: '#0a0804',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>Next →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '26px', marginBottom: '8px' }}>One last thing</div>
            <div style={{ fontSize: '14px', color: '#928ea0', marginBottom: '24px' }}>
              Have a Letterboxd account? Link it so we can import your watch history automatically.
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#4d4a58', marginBottom: '6px' }}>Letterboxd username (optional)</div>
              <input
                type="text"
                placeholder="e.g. goofymonkeyx"
                value={selected.letterboxd}
                onChange={e => setSelected(prev => ({ ...prev, letterboxd: e.target.value }))}
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
                  borderRadius: '8px', fontSize: '14px', color: '#ede9e3',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
              />
            </div>

            <div style={{
              background: 'rgba(69,190,160,0.06)', border: '1px solid rgba(69,190,160,0.15)',
              borderRadius: '10px', padding: '12px', marginBottom: '24px', fontSize: '12px', color: '#928ea0', lineHeight: '1.6',
            }}>
              Reel uses Letterboxd's public export feature — no password needed.
              Your Letterboxd account stays completely separate.
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setStep(2)} style={{
                padding: '13px 20px', borderRadius: '10px', fontSize: '14px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.11)', color: '#928ea0',
                cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>← Back</button>
              <button onClick={finish} disabled={loading} style={{
                flex: 1, padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
                background: loading ? '#8a743a' : '#c8a76b', border: 'none', color: '#0a0804',
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif',
              }}>
                {loading ? 'Setting up...' : 'Enter Reel 🎬'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
