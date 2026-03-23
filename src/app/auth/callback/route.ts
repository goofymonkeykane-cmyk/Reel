import { createServerClientInstance } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

// This route handles the redirect back from Supabase after:
// - Google OAuth login
// - Email confirmation links
// Without this file, login is completely broken

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'
  const error = searchParams.get('error')

  // Handle errors from Supabase (e.g. expired link)
  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error)}`)
  }

  if (code) {
    const supabase = createServerClientInstance()

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (!exchangeError) {
      // Successfully logged in - redirect to home or intended destination
      return NextResponse.redirect(`${origin}${next}`)
    }

    // Exchange failed
    return NextResponse.redirect(
      `${origin}/auth/login?error=Could not sign in. Please try again.`
    )
  }

  // No code - redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
