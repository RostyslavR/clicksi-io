'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on admin pages
  if (pathname === '/manage') {
    return null
  }
  
  return <Footer />
}