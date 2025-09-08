'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function DebugPage() {
  const { user } = useAuth()
  const [dbTest, setDbTest] = useState<unknown>(null)
  const [profileTest, setProfileTest] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-db')
      const result = await response.json()
      setDbTest(result)
    } catch (error) {
      setDbTest({ error: 'Failed to test database', details: error })
    }
    setLoading(false)
  }

  const testProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-profile')
      const result = await response.json()
      setProfileTest(result)
    } catch (error) {
      setProfileTest({ error: 'Failed to test profile', details: error })
    }
    setLoading(false)
  }

  const createProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: 'Test User',
          role: 'user'
        })
      })
      const result = await response.json()
      setProfileTest(result)
    } catch (error) {
      setProfileTest({ error: 'Failed to create profile', details: error })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#EDECF8] mb-8">Debug Page</h1>
        
        <div className="space-y-8">
          {/* User Info */}
          <div className="bg-[#090909] p-6 rounded-lg border border-[#202020]">
            <h2 className="text-xl font-semibold text-[#EDECF8] mb-4">Current User</h2>
            <pre className="text-[#828288] text-sm overflow-x-auto">
              {JSON.stringify(user ? { id: user.id, email: user.email } : null, null, 2)}
            </pre>
          </div>

          {/* Database Test */}
          <div className="bg-[#090909] p-6 rounded-lg border border-[#202020]">
            <h2 className="text-xl font-semibold text-[#EDECF8] mb-4">Database Test</h2>
            <button
              onClick={testDatabase}
              disabled={loading}
              className="bg-[#D78E59] text-[#171717] px-4 py-2 rounded mb-4 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Database Connection'}
            </button>
            {dbTest ? (
              <pre className="text-[#828288] text-sm overflow-x-auto bg-[#171717] p-3 rounded">
                {JSON.stringify(dbTest, null, 2)}
              </pre>
            ) : null}
          </div>

          {/* Profile Test */}
          <div className="bg-[#090909] p-6 rounded-lg border border-[#202020]">
            <h2 className="text-xl font-semibold text-[#EDECF8] mb-4">Profile Test</h2>
            <div className="space-x-4 mb-4">
              <button
                onClick={testProfile}
                disabled={loading}
                className="bg-[#D78E59] text-[#171717] px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Check Profile'}
              </button>
              <button
                onClick={createProfile}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Profile'}
              </button>
            </div>
            {profileTest ? (
              <pre className="text-[#828288] text-sm overflow-x-auto bg-[#171717] p-3 rounded">
                {JSON.stringify(profileTest, null, 2)}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}