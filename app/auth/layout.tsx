import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - Clicksi',
  description: 'Sign in or create your Clicksi account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  )
}