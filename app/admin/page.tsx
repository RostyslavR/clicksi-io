'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3,
  Database,
  FileText,
  Activity,
  AlertTriangle,
  Home,
  ArrowLeft
} from 'lucide-react'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDECF8]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">{t.navigation.dashboard}</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">{t.navigation.home}</span>
              </Link>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#EDECF8] flex items-center gap-3">
                <Shield className="w-8 h-8 text-[#D78E59]" />
                Admin Panel
              </h1>
              <p className="text-[#828288] mt-1">
                System administration and management
              </p>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-[#828288]">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">1</div>
            <div className="text-xs text-[#828288] mt-1">Registered accounts</div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-[#828288]">Pages</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">0</div>
            <div className="text-xs text-[#828288] mt-1">Created by users</div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium text-[#828288]">Activity</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">Active</div>
            <div className="text-xs text-[#828288] mt-1">System status</div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-6 h-6 text-[#D78E59]" />
              <span className="text-sm font-medium text-[#828288]">Database</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">Online</div>
            <div className="text-xs text-[#828288] mt-1">Connection status</div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/users"
            className="bg-[#090909] rounded-2xl border border-[#202020] p-6 hover:bg-[#171717] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">User Management</h3>
                <p className="text-sm text-[#828288]">Manage user accounts and permissions</p>
              </div>
            </div>
            <span className="text-sm text-blue-400 group-hover:text-blue-300 transition-colors">
              View Users →
            </span>
          </Link>

          <Link
            href="/manage"
            className="bg-[#090909] rounded-2xl border border-[#202020] p-6 hover:bg-[#171717] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#D78E59]/20 rounded-lg flex items-center justify-center group-hover:bg-[#D78E59]/30 transition-colors">
                <FileText className="w-6 h-6 text-[#D78E59]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Page Management</h3>
                <p className="text-sm text-[#828288]">Manage all user pages and content</p>
              </div>
            </div>
            <span className="text-sm text-[#D78E59] group-hover:text-[#D78E59] transition-colors">
              Manage Pages →
            </span>
          </Link>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Analytics</h3>
                <p className="text-sm text-[#828288]">Platform metrics and insights</p>
              </div>
            </div>
            <button className="text-sm text-green-400 hover:text-green-300 transition-colors">
              View Analytics →
            </button>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">System Settings</h3>
                <p className="text-sm text-[#828288]">Configure platform settings</p>
              </div>
            </div>
            <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
              Configure →
            </button>
          </div>

          <Link
            href="/debug"
            className="bg-[#090909] rounded-2xl border border-[#202020] p-6 hover:bg-[#171717] transition-colors group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <Database className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">Debug Tools</h3>
                <p className="text-sm text-[#828288]">Database and system diagnostics</p>
              </div>
            </div>
            <span className="text-sm text-orange-400 group-hover:text-orange-300 transition-colors">
              Debug →
            </span>
          </Link>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#EDECF8]">System Logs</h3>
                <p className="text-sm text-[#828288]">View system logs and errors</p>
              </div>
            </div>
            <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
              View Logs →
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] p-8">
          <h3 className="text-xl font-semibold text-[#EDECF8] mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#D78E59]" />
            System Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[#EDECF8]">Authentication Service</span>
              </div>
              <span className="text-sm text-green-400 font-medium">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[#EDECF8]">Database Connection</span>
              </div>
              <span className="text-sm text-green-400 font-medium">Connected</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[#EDECF8]">API Services</span>
              </div>
              <span className="text-sm text-green-400 font-medium">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#171717] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[#EDECF8]">File Storage</span>
              </div>
              <span className="text-sm text-green-400 font-medium">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}