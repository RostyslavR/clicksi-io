'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations } from '@/lib/translations'
import { getInitialLanguage, getBrowserLanguageInfo } from '@/lib/browser-language'
import { setLanguageCookie } from '@/lib/language-cookie'
import { availableLanguages, defaultLanguage, type Language } from '@/lib/languages'

export { availableLanguages, type Language }

interface LanguageContextType {
  currentLanguage: Language
  availableLanguages: Language[]
  changeLanguage: (language: Language) => void
  t: typeof translations.uk
  isInitialized: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ 
  children, 
  initialLanguage 
}: { 
  children: ReactNode
  initialLanguage?: Language 
}) {
  // Start with server-detected language or fallback to default
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage || defaultLanguage)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize after hydration and sync client-side preferences
  useEffect(() => {
    // If server didn't detect a saved preference, check client-side storage
    if (!initialLanguage || initialLanguage.code === defaultLanguage.code) {
      const clientLanguage = getInitialLanguage(availableLanguages, defaultLanguage)
      if (clientLanguage.code !== currentLanguage.code) {
        setCurrentLanguage(clientLanguage)
        // Save to both localStorage and cookies
        localStorage.setItem('clicksi-language', clientLanguage.code)
        setLanguageCookie(clientLanguage.code)
      }
    }
    
    setIsInitialized(true)
    
    // Debug info
    if (process.env.NODE_ENV === 'development') {
      console.log('🌍 Browser language info:', getBrowserLanguageInfo())
      console.log('🎯 Selected language:', currentLanguage.name, `(${currentLanguage.code})`)
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('clicksi-language', language.code)
    setLanguageCookie(language.code)
  }

  const t = translations[currentLanguage.code] || translations.uk

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      availableLanguages,
      changeLanguage,
      t,
      isInitialized
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return {
    currentLanguage: context.currentLanguage,
    availableLanguages: context.availableLanguages,
    changeLanguage: context.changeLanguage,
    isInitialized: context.isInitialized
  }
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return {
    t: context.t,
    currentLanguage: context.currentLanguage
  }
}