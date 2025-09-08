'use client'

import { useState, useEffect } from 'react'
import { translations } from '@/lib/translations'

export interface Language {
  code: string
  flag: string
  name: string
}

export const availableLanguages: Language[] = [
  { code: 'uk', flag: '🇺🇦', name: 'Українська' },
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
]

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(availableLanguages[0])

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('clicksi-language')
    if (savedLanguage) {
      const foundLanguage = availableLanguages.find(lang => lang.code === savedLanguage)
      if (foundLanguage) {
        setCurrentLanguage(foundLanguage)
      }
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem('clicksi-language', language.code)
    // Here you could dispatch events or call translation functions
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
  }

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
  }
}

export function useTranslation() {
  const { currentLanguage } = useLanguage()
  const [, forceUpdate] = useState({})
  
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({})
    }
    
    window.addEventListener('languageChanged', handleLanguageChange)
    return () => window.removeEventListener('languageChanged', handleLanguageChange)
  }, [])
  
  const t = translations[currentLanguage.code] || translations.uk
  
  return { t, currentLanguage }
}