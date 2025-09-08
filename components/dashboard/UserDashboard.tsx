'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUserRole } from '@/hooks/useUserRole'
import { useTranslation } from '@/contexts/LanguageContext'
import { 
  User, 
  Activity, 
  Settings, 
  Shield, 
  FileText
} from 'lucide-react'
import Link from 'next/link'

export function UserDashboard() {
  const { user } = useAuth()
  const { userProfile, isAdmin, loading: roleLoading } = useUserRole()
  const { t } = useTranslation()
  const [loading] = useState(false)


  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDECF8]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-[#828288] hover:text-[#EDECF8] transition-colors"
            >
← {t.navigation.backToHome}
            </Link>
            <h1 className="text-3xl font-bold">{t.navigation.dashboard}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#D78E59] rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#171717]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">
                  {userProfile?.full_name || 'User'}
                </h3>
                <p className="text-sm text-[#828288]">{user?.email}</p>
              </div>
            </div>
            <div className="text-xs text-[#828288]">
              Role: <span className="text-[#EDECF8] capitalize">{userProfile?.role}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#D78E59]" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/manage"
                className="flex items-center gap-3 text-[#828288] hover:text-[#EDECF8] transition-colors"
              >
                <FileText className="w-4 h-4" />
                Manage Pages
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 text-[#828288] hover:text-[#D78E59] transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

        </div>

        {/* Welcome Section */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D78E59]" />
            Welcome to your Dashboard
          </h3>
          
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-[#828288] mx-auto mb-4" />
            <p className="text-[#828288]">Your dashboard is ready to use!</p>
          </div>
        </div>
      </div>
    </div>
  )
}