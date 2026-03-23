'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({ display_name: '', bio: '', location: '', letterboxd_username: '', website: '' })

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setForm({
          display_name: data.display_name || '',
          bio: data.bio || '',
          location: data.location || '',
          letterboxd_username: data.letterboxd_username || '',
          website: data.website || '',
        })
      }
    }
    load()
  }, [])

  const save = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('profiles').update(form).eq('id', profile.id)
      if (error) throw error
      toast.success('Profile updated')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
    borderRadius: '8px', fontSize: '14px', color: '#ede9e3',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
  }

  const labelStyle = { fontSize: '12px', color: '#4d4a58', display: 'block', marginBottom: '5px' }

  return (
    <div style={{ minHeight: '100vh', background: '#08080d', color: '#ede9e3' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px', height: '46px',
        background: 'rgba(15,15,22,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/home" style={{ fontFamily: 'DM Serif Display, serif', fontSize: '18px', color: '#ede9e3', textDecoration: 'none' }}>reel</Link>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Settings</span>
      </nav>

      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '24px' }}>
        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '24px', marginBottom: '24px' }}>Edit Profile</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          <div>
            <label style={labelStyle}>Display name</label>
            <input type="text" value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} style={inputStyle as any} />
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3}
              style={{ ...inputStyle, resize: 'vertical' } as any} placeholder="Tell cinephiles about yourself..." />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle as any} placeholder="e.g. Varanasi, India" />
          </div>
          <div>
            <label style={labelStyle}>Letterboxd username</label>
            <input type="text" value={form.letterboxd_username} onChange={e => setForm({ ...form, letterboxd_username: e.target.value })} style={inputStyle as any} placeholder="e.g. goofymonkeyx" />
          </div>
          <div>
            <label style={labelStyle}>Website</label>
            <input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={inputStyle as any} placeholder="https://..." />
          </div>
        </div>

        <button onClick={save} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '500',
          background: loading ? '#8a743a' : '#c8a76b', border: 'none', color: '#0a0804',
          cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: '32px',
        }}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: '#4d4a58', marginBottom: '12px' }}>Account</div>
          <button onClick={signOut} style={{
            padding: '8px 18px', borderRadius: '20px', fontSize: '13px',
            background: 'transparent', border: '1px solid rgba(224,80,80,0.3)',
            color: '#e05050', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
