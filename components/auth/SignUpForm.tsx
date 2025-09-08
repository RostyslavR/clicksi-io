'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation, useLanguage } from '@/contexts/LanguageContext'
import { getAuthErrorMessage, isValidEmail, isValidPassword } from '@/lib/auth-utils'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function SignUpForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!isValidEmail(formData.email)) {
      setError(t.auth.errors.invalidEmail)
      setLoading(false)
      return
    }

    if (!isValidPassword(formData.password)) {
      setError(t.auth.errors.weakPassword)
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.errors.passwordMismatch)
      setLoading(false)
      return
    }

    const { error } = await signUpWithEmail(
      formData.email, 
      formData.password, 
      {
        full_name: formData.fullName,
        role: 'user' // Default role
      },
      currentLanguage.code
    )
    
    if (error) {
      setError(getAuthErrorMessage(error, (key) => {
        const errorMessages = t.auth.errors as Record<string, string>
        const keyPath = key.split('.').pop()
        return errorMessages[keyPath as keyof typeof errorMessages] || key
      }))
    } else {
      // Try to create profile immediately after signup
      try {
        const profileResponse = await fetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            role: 'user'
          })
        })
        
        const profileResult = await profileResponse.json()
        console.log('Profile creation result:', profileResult)
        
        if (!profileResult.success) {
          console.log('Profile creation failed (non-critical):', profileResult.error)
        }
      } catch (profileError) {
        console.log('Profile creation request failed (non-critical):', profileError)
      }
      
      setSuccess(true)
      // Note: User will need to confirm email before they can sign in
    }
    
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#171717] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#EDECF8] mb-4">{t.auth.success.signUpComplete}</h2>
            <p className="text-[#828288] mb-6">
              We&apos;ve sent a confirmation link to <span className="text-[#EDECF8]">{formData.email}</span>
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-[#171717] bg-[#D78E59] hover:brightness-110 transition-colors"
            >
              {t.auth.signUp.signInLink}
            </Link>
          </div>
        </div>
      </div>
    )
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
            {t.auth.signUp.title}
          </h2>
          <p className="mt-2 text-center text-sm text-[#828288]">
            {t.auth.signUp.alreadyHaveAccount}{' '}
            <Link href="/auth/login" className="font-medium text-[#D78E59] hover:underline">
              {t.auth.signUp.signInLink}
            </Link>
          </p>
        </div>

        <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleEmailSignUp}>
            <div>
              <label htmlFor="fullName" className="sr-only">
                {t.auth.signUp.fullNameLabel}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-5 h-5" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#171717] border border-[#202020] rounded-lg text-[#EDECF8] placeholder-[#828288] focus:outline-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59]"
                  placeholder={t.auth.signUp.fullNameLabel}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                {t.auth.signUp.emailLabel}
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
                  placeholder={t.auth.signUp.emailLabel}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                {t.auth.signUp.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#171717] border border-[#202020] rounded-lg text-[#EDECF8] placeholder-[#828288] focus:outline-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59]"
                  placeholder={t.auth.signUp.passwordLabel}
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                {t.auth.signUp.confirmPasswordLabel}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-5 h-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#171717] border border-[#202020] rounded-lg text-[#EDECF8] placeholder-[#828288] focus:outline-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59]"
                  placeholder={t.auth.signUp.confirmPasswordLabel}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#828288] hover:text-[#EDECF8]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
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
                  t.auth.signUp.signUpButton
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
                <span className="px-2 bg-[#090909] text-[#828288]">{t.auth.signUp.orContinueWith}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-[#202020] rounded-lg text-[#EDECF8] bg-[#171717] hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-[#D78E59] focus:ring-offset-2 focus:ring-offset-[#090909] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing up...' : t.auth.signUp.googleButton}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#828288] text-center">
            {t.auth.signUp.agreeToTerms}{' '}
            <Link href="/terms" className="text-[#D78E59] hover:underline">
              {t.auth.signUp.termsLink}
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#D78E59] hover:underline">
              {t.auth.signUp.privacyLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}