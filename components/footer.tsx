'use client'

import { Linkedin } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/contexts/LanguageContext'

const ClicksiLogo = () => (
  <svg 
    width="322" 
    height="106" 
    viewBox="0 0 322 106" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-auto text-[#EDECF8]"
  >
    <path d="M305.886 1.4668H322V104.012H305.886V1.4668Z" fill="currentColor"></path>
    <path
      d="M272.329 105.475C264.516 105.475 258.607 103.278 254.603 98.8829C250.599 94.3904 248.597 87.9936 248.597 79.6923V73.8326H263.832V80.8642C263.832 87.5053 266.615 90.8258 272.182 90.8258C274.917 90.8258 276.968 90.0445 278.335 88.4819C279.8 86.8216 280.532 84.1847 280.532 80.5712C280.532 76.2741 279.556 72.5141 277.602 69.2913C275.649 65.9708 272.036 62.0154 266.762 57.4253C260.121 51.5656 255.482 46.2918 252.845 41.6041C250.208 36.8186 248.89 31.4472 248.89 25.4898C248.89 17.3839 250.941 11.1335 255.042 6.73869C259.144 2.24623 265.102 0 272.915 0C280.63 0 286.441 2.24623 290.347 6.73869C294.351 11.1335 296.353 17.4815 296.353 25.7828V30.0311H281.118V24.7573C281.118 21.2415 280.435 18.7023 279.067 17.1397C277.7 15.4794 275.698 14.6493 273.061 14.6493C267.69 14.6493 265.004 17.921 265.004 24.4644C265.004 28.1755 265.981 31.6425 267.934 34.8654C269.985 38.0882 273.647 41.9947 278.921 46.5848C285.659 52.4446 290.298 57.7671 292.838 62.5526C295.377 67.338 296.646 72.9536 296.646 79.3993C296.646 87.7982 294.547 94.2439 290.347 98.7364C286.245 103.229 280.239 105.475 272.329 105.475Z"
      fill="currentColor"></path>
    <path
      d="M191.724 1.4668H207.838V44.6823L228.347 1.4668H244.462L225.271 39.1155L244.755 104.012H227.908L214.284 58.3061L207.838 71.344V104.012H191.724V1.4668Z"
      fill="currentColor"></path>
    <path
      d="M158.351 105.475C150.636 105.475 144.727 103.278 140.625 98.8829C136.621 94.4881 134.619 88.2866 134.619 80.2783V25.1968C134.619 17.1885 136.621 10.987 140.625 6.5922C144.727 2.1974 150.636 0 158.351 0C166.066 0 171.926 2.1974 175.93 6.5922C180.032 10.987 182.083 17.1885 182.083 25.1968V36.0373H166.848V24.1714C166.848 17.8233 164.162 14.6493 158.791 14.6493C153.419 14.6493 150.733 17.8233 150.733 24.1714V81.4502C150.733 87.7006 153.419 90.8258 158.791 90.8258C164.162 90.8258 166.848 87.7006 166.848 81.4502V65.7754H182.083V80.2783C182.083 88.2866 180.032 94.4881 175.93 98.8829C171.926 103.278 166.066 105.475 158.351 105.475Z"
      fill="currentColor"></path>
    <path d="M107.462 1.4668H123.576V104.012H107.462V1.4668Z" fill="currentColor"></path>
    <path d="M57.105 1.4668H73.2192V89.3627H99.7345V104.012H57.105V1.4668Z" fill="currentColor"></path>
    <path
      d="M23.7319 105.475C16.0166 105.475 10.108 103.278 6.00622 98.8829C2.00207 94.4881 0 88.2866 0 80.2783V25.1968C0 17.1885 2.00207 10.987 6.00622 6.5922C10.108 2.1974 16.0166 0 23.7319 0C31.4472 0 37.3069 2.1974 41.3111 6.5922C45.4129 10.987 47.4638 17.1885 47.4638 25.1968V36.0373H32.2285V24.1714C32.2285 17.8233 29.5428 14.6493 24.1714 14.6493C18.8 14.6493 16.1142 17.8233 16.1142 24.1714V81.4502C16.1142 87.7006 18.8 90.8258 24.1714 90.8258C29.5428 90.8258 32.2285 87.7006 32.2285 81.4502V65.7754H47.4638V80.2783C47.4638 88.2866 45.4129 94.4881 41.3111 98.8829C37.3069 103.278 31.4472 105.475 23.7319 105.475Z"
      fill="currentColor"></path>
  </svg>
)

export function Footer() {
  const { t } = useTranslation()
  
  return (
    <footer className="bg-[#090909] text-[#EDECF8] py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-end gap-2">
              <ClicksiLogo />
              <span className="bg-[#D78E59] text-[#171717] px-2 py-1 rounded text-xs font-semibold">
                Beta
              </span>
            </Link>
            <p className="text-[#828288] mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/107567112"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#828288] hover:text-[#D78E59] transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">{t.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.quickLinks.home}
                </Link>
              </li>
              <li>
                <a href="#features" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.quickLinks.features}
                </a>
              </li>
              <li>
                <a href="#beta_benefits" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.quickLinks.betaBenefits}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.quickLinks.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">{t.footer.legal.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.legal.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-[#828288] hover:text-[#D78E59] transition-colors">
                  {t.footer.legal.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#202020]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#828288] text-sm mb-4 md:mb-0">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}