'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useUserRole } from '@/hooks/useUserRole'
import { useTranslation, useLanguage } from '@/contexts/LanguageContext'
import { 
  User, 
  LogOut, 
  Settings, 
  Shield, 
  ChevronDown,
  LogIn,
  UserPlus,
  Globe
} from 'lucide-react'

export function AuthButton() {
  const [isMounted, setIsMounted] = useState(false)
  const { user, signOut, loading: authLoading, updateUserLanguage } = useAuth()
  const { userProfile, isAdmin, loading: roleLoading } = useUserRole()
  
  // Always call hooks - use fallback values if context is not available
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const languages = [
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' }
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsDropdownOpen(false)
    router.push('/')
  }
  
  const handleLanguageChange = async (languageCode: string) => {
    // Update UI language immediately (if available)
    if (changeLanguage && typeof changeLanguage === 'function') {
      const language = availableLanguages.find(lang => lang.code === languageCode)
      if (language) {
        changeLanguage(language)
      }
    }
    
    // If user is authenticated, also update their profile
    if (user && updateUserLanguage) {
      await updateUserLanguage(languageCode)
    }
  }

  // Loading state or not mounted (prevents hydration mismatch)
  if (!isMounted || authLoading || roleLoading) {
    return (
      <div className="w-8 h-8 bg-[#202020] rounded-full animate-pulse" />
    )
  }

  // Not authenticated - show login/signup buttons
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-3 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors text-sm font-medium"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">{t.auth.signIn.title}</span>
        </Link>
        <Link
          href="/auth/signup"
          className="flex items-center gap-2 px-3 py-2 bg-[#D78E59] text-[#171717] hover:brightness-110 rounded-lg transition-colors text-sm font-medium"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">{t.auth.signUp.title}</span>
        </Link>
      </div>
    )
  }

  // Authenticated - show user dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] rounded-lg transition-colors"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="w-6 h-6 bg-[#D78E59] rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-[#171717]" />
        </div>
        <span className="text-sm font-medium hidden sm:inline">
          {userProfile?.full_name || 'User'}
        </span>
        {isAdmin && (
          <Shield className="w-3 h-3 text-[#D78E59]" />
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#202020] border border-[#575757] rounded-lg shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#575757]">
            <div className="text-sm font-medium text-[#EDECF8]">
              {userProfile?.full_name || 'User'}
            </div>
            <div className="text-xs text-[#828288]">{user.email}</div>
            {userProfile?.role && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#828288] capitalize">
                  {userProfile.role}
                </span>
                {isAdmin && <Shield className="w-3 h-3 text-[#D78E59]" />}
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={isAdmin ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#EDECF8] hover:bg-[#171717] transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="w-4 h-4" />
              {isAdmin ? "Admin Dashboard" : "Dashboard"}
            </Link>
            
            <Link
              href="/manage"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#EDECF8] hover:bg-[#171717] transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Manage Pages
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 text-sm text-[#D78E59] hover:bg-[#171717] transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Language Selection */}
          <div className="border-t border-[#575757] py-1">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-xs text-[#828288] mb-2">
                <Globe className="w-3 h-3" />
                {t?.auth?.profile?.language || 'Language'}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-2 text-xs rounded transition-colors text-center ${
                      currentLanguage.code === lang.code
                        ? 'bg-[#D78E59] text-[#171717] font-medium'
                        : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#171717]'
                    }`}
                  >
                    <div className="text-xs mb-1">{lang.flag}</div>
                    <div className="text-xs">{lang.name.slice(0, 3)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="border-t border-[#575757]">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#828288] hover:text-[#EDECF8] hover:bg-[#171717] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}