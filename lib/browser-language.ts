import { type Language } from '@/lib/languages'

/**
 * Detects the user's preferred language from browser settings
 * @param supportedLanguages Array of supported language objects
 * @param fallbackLanguage Default language to use if no match found
 * @returns Language object that best matches user's browser language
 */
export function detectBrowserLanguage(
  supportedLanguages: Language[], 
  fallbackLanguage: Language
): Language {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return fallbackLanguage
  }

  // Get user's language preferences in order of priority
  const browserLanguages = [
    navigator.language,                    // Primary language (e.g., 'en-US')
    ...(navigator.languages || []),        // All preferred languages
  ]

  // Extract language codes and normalize them
  const normalizedBrowserLangs = browserLanguages.map(lang => {
    // Convert 'en-US' -> 'en', 'uk-UA' -> 'uk', etc.
    return lang.toLowerCase().split('-')[0]
  })

  // Find first supported language that matches browser preference
  for (const browserLang of normalizedBrowserLangs) {
    const matchedLanguage = supportedLanguages.find(
      lang => lang.code.toLowerCase() === browserLang
    )
    
    if (matchedLanguage) {
      console.log(`🌍 Detected browser language: ${browserLang} -> ${matchedLanguage.name}`)
      return matchedLanguage
    }
  }

  // No match found, use fallback
  console.log(`🌍 No supported browser language found, using fallback: ${fallbackLanguage.name}`)
  return fallbackLanguage
}

/**
 * Gets the initial language considering:
 * 1. Previously saved user preference (localStorage)
 * 2. Browser language detection
 * 3. Fallback language
 */
export function getInitialLanguage(
  supportedLanguages: Language[],
  fallbackLanguage: Language
): Language {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return fallbackLanguage
  }

  try {
    // 1. Check localStorage first (fastest)
    const savedLanguageCode = localStorage.getItem('clicksi-language')
    if (savedLanguageCode) {
      const savedLanguage = supportedLanguages.find(
        lang => lang.code === savedLanguageCode
      )
      if (savedLanguage) {
        console.log(`💾 Using saved language preference: ${savedLanguage.name}`)
        return savedLanguage
      }
    }

    // 2. Check cookies as backup
    const cookieLanguageCode = getLanguageFromCookie()
    if (cookieLanguageCode) {
      const cookieLanguage = supportedLanguages.find(
        lang => lang.code === cookieLanguageCode
      )
      if (cookieLanguage) {
        console.log(`🍪 Using cookie language preference: ${cookieLanguage.name}`)
        // Sync to localStorage for faster future access
        localStorage.setItem('clicksi-language', cookieLanguageCode)
        return cookieLanguage
      }
    }

    // 3. No saved preference, detect from browser
    return detectBrowserLanguage(supportedLanguages, fallbackLanguage)
    
  } catch (error) {
    console.warn('Error detecting language preferences:', error)
    return fallbackLanguage
  }
}

function getLanguageFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'clicksi-language') {
      return decodeURIComponent(value)
    }
  }
  return null
}

/**
 * Gets a human-readable name for the detected browser language
 */
export function getBrowserLanguageInfo(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'Server-side rendering'
  }

  const primary = navigator.language
  const all = navigator.languages?.join(', ') || primary
  
  return `Primary: ${primary}, All: [${all}]`
}