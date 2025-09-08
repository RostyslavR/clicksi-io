'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useUserRole } from '@/hooks/useUserRole'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Home, 
  Settings, 
 
  BarChart3,
  ArrowLeft,
  Shield
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: roleLoading } = useUserRole()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Redirect non-admins to regular dashboard
  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isAdmin) {
      router.push('/dashboard')
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Redirecting to user dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDECF8]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Home</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#EDECF8]">Admin Dashboard</h1>
              <p className="text-[#828288] mt-1">
                Welcome back, {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#D78E59] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#171717]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#EDECF8]">Admin Dashboard</h2>
              <p className="text-[#828288]">Manage your Clicksi platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#171717] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-[#D78E59]" />
                <span className="text-sm font-medium text-[#EDECF8]">Admin Status</span>
              </div>
              <p className="text-xs text-[#828288]">Full access enabled</p>
            </div>
            
            <div className="bg-[#171717] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-[#EDECF8]">Security</span>
              </div>
              <p className="text-xs text-[#828288]">System protected</p>
            </div>
            
            <div className="bg-[#171717] rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-[#EDECF8]">Platform</span>
              </div>
              <p className="text-xs text-[#828288]">All systems operational</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/manage"
            className="bg-[#090909] rounded-2xl border border-[#202020] p-6 hover:bg-[#171717] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#D78E59]/20 rounded-lg flex items-center justify-center group-hover:bg-[#D78E59]/30 transition-colors">
                <Settings className="w-6 h-6 text-[#D78E59]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Manage Pages</h3>
                <p className="text-sm text-[#828288]">Create and edit pages</p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin"
            className="bg-[#090909] rounded-2xl border border-[#202020] p-6 hover:bg-[#171717] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#D78E59]/20 rounded-lg flex items-center justify-center group-hover:bg-[#D78E59]/30 transition-colors">
                <Shield className="w-6 h-6 text-[#D78E59]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Admin Panel</h3>
                <p className="text-sm text-[#828288]">System administration</p>
              </div>
            </div>
          </Link>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Analytics</h3>
                <p className="text-sm text-[#828288]">Platform metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] p-8">
          <h3 className="text-xl font-semibold text-[#EDECF8] mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-[#EDECF8]">Authentication Service</span>
              </div>
              <span className="text-sm text-green-400">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-[#EDECF8]">Database</span>
              </div>
              <span className="text-sm text-green-400">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-[#EDECF8]">API Services</span>
              </div>
              <span className="text-sm text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}