'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              username: form.username,
              full_name: form.displayName,
            },
          },
        })
        if (error) throw error
        toast.success('Welcome to Reel! Check your email to confirm.')
        router.push('/onboarding')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        })
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/home')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#08080d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px',
        background: '#0f0f16', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            fontFamily: 'DM Serif Display, serif', fontSize: '28px',
            color: '#ede9e3', marginBottom: '6px',
          }}>
            reel
          </div>
          <div style={{ fontSize: '14px', color: '#928ea0' }}>
            {mode === 'login' ? 'Welcome back, cinephile' : 'Join the cinema community'}
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '11px', borderRadius: '10px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.11)',
            color: '#ede9e3', fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '20px', fontFamily: 'DM Sans, sans-serif',
          }}
        >
          <span style={{ fontSize: '18px' }}>G</span>
          Continue with Google
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize: '12px', color: '#4d4a58' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Username (e.g. goofymonkey)"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                required
                style={{
                  background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
                  borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
                  color: '#ede9e3', outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <input
                type="text"
                placeholder="Display name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
                style={{
                  background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
                  borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
                  color: '#ede9e3', outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            style={{
              background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              color: '#ede9e3', outline: 'none', fontFamily: 'DM Sans, sans-serif',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
            style={{
              background: '#1a1a24', border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: '8px', padding: '11px 14px', fontSize: '14px',
              color: '#ede9e3', outline: 'none', fontFamily: 'DM Sans, sans-serif',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#8a743a' : '#c8a76b',
              border: 'none', borderRadius: '10px',
              color: '#0a0804', fontSize: '14px', fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans, sans-serif', marginTop: '4px',
            }}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create free account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#4d4a58' }}>
          {mode === 'login' ? (
            <>
              No account?{' '}
              <Link href="/auth/signup" style={{ color: '#c8a76b', textDecoration: 'none' }}>
                Join free
              </Link>
            </>
          ) : (
            <>
              Already have one?{' '}
              <Link href="/auth/login" style={{ color: '#c8a76b', textDecoration: 'none' }}>
                Sign in
              </Link>
            </>
          )}
        </div>

        {mode === 'signup' && (
          <div style={{
            marginTop: '16px', padding: '12px',
            background: 'rgba(123,105,238,0.06)',
            border: '1px solid rgba(123,105,238,0.15)',
            borderRadius: '8px', fontSize: '11px', color: '#928ea0',
            lineHeight: '1.6', textAlign: 'center',
          }}>
            Reel is free forever. No credit card. No premium tier.
            Your data is yours — export it anytime.
          </div>
        )}
      </div>
    </div>
  )
}
