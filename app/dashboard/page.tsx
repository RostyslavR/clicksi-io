'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useUserRole } from '@/hooks/useUserRole'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserDashboard } from '@/components/dashboard/UserDashboard'

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: roleLoading } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && !roleLoading && user && isAdmin) {
      router.push('/admin/dashboard')
    }
  }, [user, isAdmin, authLoading, roleLoading, router])

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  // Don't show user dashboard to admins (they'll be redirected)
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Redirecting to admin dashboard...</div>
      </div>
    )
  }

  return <UserDashboard />
}