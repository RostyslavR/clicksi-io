'use client'

/**
 * Cookie-based language persistence that works with SSR
 */

export const LANGUAGE_COOKIE_NAME = 'clicksi-language'

export function getLanguageFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === LANGUAGE_COOKIE_NAME) {
      return decodeURIComponent(value)
    }
  }
  return null
}

export function setLanguageCookie(languageCode: string) {
  if (typeof document === 'undefined') return
  
  // Set cookie that expires in 1 year
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)
  
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(languageCode)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}