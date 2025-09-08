'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Users, 
  ArrowLeft, 
  Shield, 
  Mail,
  Calendar,
  Clock,
  Edit,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  profile: {
    full_name: string | null
    role: string
  } | null
  role: string
  full_name: string | null
}

export default function UserManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await fetch('/api/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to load users')
      console.error('Error fetching users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          updates: { role: newRole }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, role: newRole, profile: u.profile ? { ...u.profile, role: newRole } : { full_name: null, role: newRole } }
            : u
        ))
        setEditingUser(null)
      } else {
        setError(data.error || 'Failed to update user')
      }
    } catch (err) {
      setError('Failed to update user')
      console.error('Error updating user:', err)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#828288]">Loading users...</div>
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
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Admin Panel</span>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#EDECF8] flex items-center gap-3">
                <Users className="w-8 h-8 text-[#D78E59]" />
                User Management
              </h1>
              <p className="text-[#828288] mt-1">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-sm font-medium text-[#828288]">Total Users</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">{users.length}</div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-[#D78E59]" />
              <span className="text-sm font-medium text-[#828288]">Admins</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-sm font-medium text-[#828288]">Verified</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">
              {users.filter(u => u.email_confirmed_at).length}
            </div>
          </div>

          <div className="bg-[#090909] rounded-2xl border border-[#202020] p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-purple-400" />
              <span className="text-sm font-medium text-[#828288]">Recently Active</span>
            </div>
            <div className="text-2xl font-bold text-[#EDECF8]">
              {users.filter(u => {
                if (!u.last_sign_in_at) return false
                const lastSignIn = new Date(u.last_sign_in_at)
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                return lastSignIn > sevenDaysAgo
              }).length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#090909] rounded-2xl border border-[#202020] overflow-hidden">
          <div className="p-6 border-b border-[#202020]">
            <h2 className="text-xl font-semibold text-[#EDECF8] flex items-center gap-3">
              <Users className="w-6 h-6" />
              All Users
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#202020] text-[#828288]">
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Created</th>
                  <th className="text-left p-4 font-medium">Last Sign In</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData.id} className="border-b border-[#202020] hover:bg-[#171717] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D78E59] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#171717]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#EDECF8]">
                            {userData.full_name || userData.profile?.full_name || 'No Name'}
                          </div>
                          <div className="text-sm text-[#828288] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {userData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingUser === userData.id ? (
                        <select
                          value={userData.role}
                          onChange={(e) => updateUserRole(userData.id, e.target.value)}
                          className="bg-[#171717] border border-[#202020] rounded px-3 py-1 text-[#EDECF8] text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          userData.role === 'admin' 
                            ? 'bg-[#D78E59]/20 text-[#D78E59]'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {userData.role}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {userData.email_confirmed_at ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          userData.email_confirmed_at ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {userData.email_confirmed_at ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#EDECF8] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#828288]" />
                        {formatDate(userData.created_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#828288] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(userData.last_sign_in_at)}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setEditingUser(editingUser === userData.id ? null : userData.id)}
                        className="p-2 hover:bg-[#202020] rounded transition-colors"
                      >
                        {editingUser === userData.id ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Edit className="w-4 h-4 text-[#828288]" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}