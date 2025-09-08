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

export const defaultLanguage = availableLanguages.find(lang => lang.code === 'en') || availableLanguages[0]