'use client'

import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { getAuthErrorMessage } from '@/lib/auth-utils'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  signInWithEmail: (email: string, password: string, preferredLanguage?: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string, userData?: Record<string, unknown>, preferredLanguage?: string) => Promise<{ error: Error | null }>
  signInWithGoogle: (preferredLanguage?: string) => Promise<{ error: Error | null }>
  refreshUser: () => Promise<void>
  updateUserLanguage: (language: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef(createClient())
  const previousUserRef = useRef<User | null>(null)
  
  // Use stable supabase client
  const supabase = supabaseRef.current

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    // If user exists but no profile, create one
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!profile) {
        try {
          await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || null,
              role: user.user_metadata?.role || 'user'
            })
        } catch (error) {
          console.log('Profile creation during refresh failed:', error)
        }
      }
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null
      
      // When user signs in, ensure they have a profile
      if (newUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', newUser.id)
            .single()
          
          // Create profile if it doesn't exist
          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: newUser.id,
                email: newUser.email || '',
                full_name: newUser.user_metadata?.full_name || null,
                role: newUser.user_metadata?.role || 'user'
              })
            
            if (profileError) {
              console.log('Profile creation error:', profileError)
            } else {
              console.log('Profile created for user:', newUser.id)
            }
          }
        } catch (error) {
          console.log('Profile check/creation error:', error)
        }
      }
      
      // Track login when user signs in (transition from null to user)
      if (!previousUserRef.current && newUser && event === 'SIGNED_IN') {
        try {
          // Track login activity
          await supabase
            .from('user_statistics')
            .insert({
              user_id: newUser.id,
              action_type: 'login',
              action_details: {
                user_email: newUser.email,
                auth_provider: newUser.app_metadata?.provider || 'email',
                session_start: new Date().toISOString()
              },
              metadata: {
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
              }
            })
        } catch (error) {
          // Silent fail - don't break authentication flow
          console.log('Failed to track login activity:', error)
        }
      }
      
      previousUserRef.current = newUser
      setSession(session)
      setUser(newUser)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, []) // Empty dependency array since we're using a stable supabase client

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      setSession(null)
    }
  }

  const signInWithEmail = async (email: string, password: string, preferredLanguage?: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // If successful and language preference provided, update user profile
    if (!error && preferredLanguage) {
      await updateUserLanguage(preferredLanguage)
    }
    
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string, userData?: Record<string, unknown>, preferredLanguage?: string) => {
    try {
      // Use a simpler signup approach to avoid database trigger issues
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            preferred_language: preferredLanguage || 'uk',
            email_confirm: false // Skip email confirmation for now
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Signup auth error:', error)
        return { error }
      }
      
      // For now, don't try to create the profile immediately
      // The profile will be created when the user first signs in
      console.log('User created successfully:', data.user?.id)
      
      return { error: null }
    } catch (err) {
      console.error('Signup error:', err)
      return { error: err as Error }
    }
  }

  const signInWithGoogle = async (preferredLanguage?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: preferredLanguage ? { preferred_language: preferredLanguage } : {}
      }
    })
    return { error }
  }
  
  const updateUserLanguage = async (language: string) => {
    if (!user) return
    
    try {
      // Update user profile with language preference
      await supabase
        .from('user_profiles')
        .update({ preferred_language: language })
        .eq('id', user.id)
      
      console.log('Language preference updated:', language)
    } catch (error) {
      console.error('Failed to update language preference:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    refreshUser,
    updateUserLanguage,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}