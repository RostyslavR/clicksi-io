'use client'

import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'

export function Hero() {
  const { t } = useTranslation()
  
  return (
    <header className="relative bg-gradient-to-b from-[#171717] via-[#141414] to-[#090909] py-20 px-6 md:py-32 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#D78E59] font-semibold text-sm md:text-base tracking-wider uppercase">
            {t.hero.announcement}
          </p>
        </div>
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#D78E59] mb-6">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#EDECF8] max-w-3xl mx-auto mb-8">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-bold py-3 px-8 h-auto text-base">
              {t.hero.joinBeta}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent hover:bg-[#202020] text-[#EDECF8] font-bold py-3 px-8 h-auto text-base border-2 border-[#575757] hover:border-[#575757]"
            >
              {t.hero.learnMore}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}