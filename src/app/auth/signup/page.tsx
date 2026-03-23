import AuthForm from '@/components/ui/AuthForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Reel — Free',
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
