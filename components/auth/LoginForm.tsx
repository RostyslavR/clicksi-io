'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation, useLanguage } from '@/contexts/LanguageContext'
import { getAuthErrorMessage, isValidEmail } from '@/lib/auth-utils'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError(t.auth.errors.invalidEmail)
      setLoading(false)
      return
    }

    const { error } = await signInWithEmail(email, password, currentLanguage.code)
    
    if (error) {
      setError(getAuthErrorMessage(error, (key) => {
        const errorMessages = t.auth.errors as Record<string, string>
        const keyPath = key.split('.').pop()
        return errorMessages[keyPath as keyof typeof errorMessages] || key
      }))
    } else {
      router.push('/')
    }
    
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    const { error } = await signInWithGoogle(currentLanguage.code)
    
    if (error) {
      setError(getAuthErrorMessage(error, (key) => {
        const errorMessages = t.auth.errors as Record<string, string>
        const keyPath = key.split('.').pop()
        return errorMessages[keyPath as keyof typeof errorMessages] || key
      }))
      setLoading(false)
    }
    // Google OAuth will redirect, so no need to set loading to false
  }

  return (
    <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div>
          <Link href="/">
            <button className="flex items-center gap-2 text-[#828288] hover:text-[#EDECF8] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.navigation.backToHome}
            </button>
          </Link>
        </div>
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#EDECF8]">
            {t.auth.signIn.title}
          </h2>
          <p className="mt-2 text-center text-sm text-[#828288]">
            {t.auth.signIn.noAccount}{' '}
            <Link href="/auth/signup" className="font-medium text-[#D78E59] hover:underline">
              {t.auth.signIn.signUpLink}
            </Link>
          </p>
        </div>

        <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="sr-only">
                {t.auth.signIn.emailLabel}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#171717] border border-[#202020] rounded-lg text-[#EDECF8] placeholder-[#828288] focus:outline-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59]"
                  placeholder={t.auth.signIn.emailLabel}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t.auth.signIn.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#171717] border border-[#202020] rounded-lg text-[#EDECF8] placeholder-[#828288] focus:outline-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59]"
                  placeholder={t.auth.signIn.passwordLabel}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#828288] hover:text-[#EDECF8]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#D78E59] focus:ring-[#D78E59] border-[#202020] rounded bg-[#171717]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#828288]">
                  {t.auth.signIn.rememberMe}
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-[#D78E59] hover:underline">
                  {t.auth.signIn.forgotPassword}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-[#171717] bg-[#D78E59] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] focus:ring-offset-[#090909] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t.auth.signIn.signInButton
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#202020]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#090909] text-[#828288]">{t.auth.signIn.orContinueWith}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#202020] rounded-lg text-[#EDECF8] bg-[#171717] hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-[#D78E59] focus:ring-offset-2 focus:ring-offset-[#090909] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing in...' : t.auth.signIn.googleButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}