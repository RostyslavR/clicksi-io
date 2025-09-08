'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { UserProfile, UserRole } from '@/lib/types/auth'

export function useUserRole() {
  const { user, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const fetchUserProfile = async () => {
      if (!user) {
        if (mounted) {
          setUserProfile(null)
          setError(null)
          setLoading(false)
        }
        return
      }

      try {
        const supabase = createClient()
        
        // Add a small delay to avoid rapid successive calls
        timeoutId = setTimeout(async () => {
          if (!mounted) return
          
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (mounted) {
            if (error) {
              // Check if it's a table not found error (expected during setup)
              if (error.message?.includes('relation "public.user_profiles" does not exist') || 
                  error.code === 'PGRST116' || error.code === '42P01') {
                // Silent handling during development - tables don't exist yet
                setUserProfile(null)
                setError(null)
              } else {
                console.error('Error fetching user profile:', error)
                setError(error.message)
              }
            } else {
              setUserProfile(data)
              setError(null)
            }
            setLoading(false)
          }
        }, 100)
      } catch (err) {
        if (mounted) {
          console.error('Unexpected error:', err)
          setError('Failed to fetch user profile')
          setLoading(false)
        }
      }
    }

    if (!authLoading && user !== null) {
      fetchUserProfile()
    } else if (!authLoading && user === null) {
      // User is definitely not authenticated
      setUserProfile(null)
      setError(null)
      setLoading(false)
    }

    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user?.id, authLoading]) // Use user.id instead of user object to reduce re-renders

  const isAdmin = userProfile?.role === 'admin'
  const isUser = userProfile?.role === 'user'
  const hasRole = (role: UserRole) => userProfile?.role === role

  return {
    userProfile,
    isAdmin,
    isUser,
    hasRole,
    loading: authLoading || loading,
    error,
  }
}