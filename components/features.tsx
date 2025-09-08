'use client'

import { useState } from 'react'
import { Monitor, DollarSign, Users } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

export function Features() {
  const [activeTab, setActiveTab] = useState('brands')
  const { t } = useTranslation()

  const brandFeatures = [
    {
      step: 1,
      title: t.features.brandSteps.registration.title,
      description: t.features.brandSteps.registration.description
    },
    {
      step: 2,
      title: t.features.brandSteps.setup.title,
      description: t.features.brandSteps.setup.description
    },
    {
      step: 3,
      title: t.features.brandSteps.search.title,
      description: t.features.brandSteps.search.description
    },
    {
      step: 4,
      title: t.features.brandSteps.collaboration.title,
      description: t.features.brandSteps.collaboration.description
    },
    {
      step: 5,
      title: t.features.brandSteps.results.title,
      description: t.features.brandSteps.results.description
    }
  ]

  const creatorFeatures = [
    {
      step: 1,
      title: t.features.creatorSteps.join.title,
      description: t.features.creatorSteps.join.description
    },
    {
      step: 2,
      title: t.features.creatorSteps.choose.title,
      description: t.features.creatorSteps.choose.description
    },
    {
      step: 3,
      title: t.features.creatorSteps.promote.title,
      description: t.features.creatorSteps.promote.description
    },
    {
      step: 4,
      title: t.features.creatorSteps.earn.title,
      description: t.features.creatorSteps.earn.description
    },
    {
      step: 5,
      title: t.features.creatorSteps.grow.title,
      description: t.features.creatorSteps.grow.description
    }
  ]

  const activeFeatures = activeTab === 'brands' ? brandFeatures : creatorFeatures

  return (
    <section 
      id="features"
      className="py-24 px-6 lg:px-8 bg-gradient-to-b from-[#171717] via-[#141414] to-[#090909] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D78E59] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFAA6C] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 bg-[#D78E59]/10 border border-[#D78E59]/20 text-[#D78E59] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Monitor className="w-4 h-4" />
            <span>{t.features.badge}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-[#EDECF8] mb-6 leading-tight">
            {t.features.title}
          </h2>
          <p className="text-2xl text-[#828288] max-w-4xl mx-auto leading-relaxed">
            {t.features.subtitle}
          </p>
        </div>
        
        <div className="mb-16">
          <div className="flex justify-center mb-12">
            <div className="bg-[#171717] p-2 rounded-2xl border border-[#202020] flex gap-2">
              <button
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'brands'
                    ? 'bg-[#D78E59] text-[#171717] shadow-lg'
                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                }`}
                onClick={() => setActiveTab('brands')}
              >
                <DollarSign className="w-5 h-5" />
                <span>{t.features.tabs.brands}</span>
              </button>
              <button
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'creators'
                    ? 'bg-[#D78E59] text-[#171717] shadow-lg'
                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                }`}
                onClick={() => setActiveTab('creators')}
              >
                <Users className="w-5 h-5" />
                <span>{t.features.tabs.creators}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-24">
          <div className="grid lg:grid-cols-5 gap-8 relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D78E59]/20 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] opacity-50 animate-pulse"></div>
            </div>
            
            {activeFeatures.map((feature) => (
              <div key={feature.step} className="relative">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] rounded-full flex items-center justify-center text-[#171717] font-bold text-xl mx-auto mb-4 relative z-10">
                    {feature.step}
                  </div>
                  <h3 className="text-2xl font-bold text-[#EDECF8] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#828288] leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}