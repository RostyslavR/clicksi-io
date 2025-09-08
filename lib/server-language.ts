import { cookies, headers } from 'next/headers'
import { availableLanguages, defaultLanguage, type Language } from '@/lib/languages'

/**
 * Server-side language detection from cookies and Accept-Language header
 */
export async function getServerLanguage(): Promise<Language> {
  try {
    // 1. Check for saved user preference in cookies
    const cookieStore = await cookies()
    const savedLanguage = cookieStore.get('clicksi-language')?.value
    
    if (savedLanguage) {
      const language = availableLanguages.find(lang => lang.code === savedLanguage)
      if (language) {
        return language
      }
    }

    // 2. Check Accept-Language header for browser preference
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')
    
    if (acceptLanguage) {
      // Parse Accept-Language header (e.g., "en-US,en;q=0.9,uk;q=0.8")
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code] = lang.trim().split(';')[0].split('-')
          return code.toLowerCase()
        })

      // Find first supported language
      for (const browserLang of languages) {
        const language = availableLanguages.find(
          lang => lang.code.toLowerCase() === browserLang
        )
        if (language) {
          return language
        }
      }
    }

    // 3. Fallback to default language
    return defaultLanguage
    
  } catch (error) {
    console.warn('Error detecting server language:', error)
    return defaultLanguage
  }
}