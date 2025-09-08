'use client'

import { Sparkles, Crown, Zap, TrendingUp, Shield, Users } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

export function BetaBenefits() {
  const { t } = useTranslation()
  
  const benefits = [
    {
      icon: Crown,
      title: t.betaBenefits.benefits.priorityAccess.title,
      description: t.betaBenefits.benefits.priorityAccess.description
    },
    {
      icon: Zap,
      title: t.betaBenefits.benefits.reducedFees.title,
      description: t.betaBenefits.benefits.reducedFees.description
    },
    {
      icon: TrendingUp,
      title: t.betaBenefits.benefits.personalSupport.title,
      description: t.betaBenefits.benefits.personalSupport.description
    },
    {
      icon: Shield,
      title: t.betaBenefits.benefits.exclusiveFeatures.title,
      description: t.betaBenefits.benefits.exclusiveFeatures.description
    },
    {
      icon: Users,
      title: t.betaBenefits.benefits.closedCommunity.title,
      description: t.betaBenefits.benefits.closedCommunity.description
    }
  ]

  return (
    <section 
      id="beta_benefits"
      className="py-24 px-6 lg:px-8 bg-gradient-to-b from-[#090909] via-[#0F0F0F] to-[#171717] relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-20 w-96 h-96 bg-[#D78E59] rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-[#FFAA6C] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#D78E59]/10 border border-[#D78E59]/20 text-[#D78E59] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t.betaBenefits.badge}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-[#EDECF8] mb-6 leading-tight">
            {t.betaBenefits.title}
          </h2>
          <p className="text-2xl text-[#828288] max-w-4xl mx-auto leading-relaxed">
            {t.betaBenefits.subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <div className="bg-gradient-to-b from-[#171717] to-[#090909] p-10 rounded-3xl border-2 border-[#D78E59]/30 shadow-2xl shadow-[#D78E59]/10">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] rounded-2xl flex items-center justify-center mr-6">
                  <Crown className="w-8 h-8 text-[#171717]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#EDECF8] mb-2">
                    {t.betaBenefits.forCreators.title}
                  </h3>
                  <p className="text-[#828288]">
                    {t.betaBenefits.forCreators.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#D78E59]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-[#D78E59]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#EDECF8] mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-[#828288] leading-relaxed text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-b from-[#171717] to-[#090909] p-10 rounded-3xl border-2 border-[#FFAA6C]/30 shadow-2xl shadow-[#FFAA6C]/10">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FFAA6C] to-[#D78E59] rounded-2xl flex items-center justify-center mr-6">
                  <TrendingUp className="w-8 h-8 text-[#171717]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#EDECF8] mb-2">
                    {t.betaBenefits.forBrands.title}
                  </h3>
                  <p className="text-[#828288]">
                    {t.betaBenefits.forBrands.subtitle}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                {benefits.slice(2, 5).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#FFAA6C]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-[#FFAA6C]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#EDECF8] mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-[#828288] leading-relaxed text-base">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#D78E59]/10 to-[#FFAA6C]/10 border border-[#D78E59]/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[#EDECF8] mb-4">
              {t.betaBenefits.cta.title}
            </h3>
            <p 
              className="text-[#828288] mb-6"
              dangerouslySetInnerHTML={{ __html: t.betaBenefits.cta.description }}
            />
            <button className="bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] text-[#171717] font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#D78E59]/25">
              {t.betaBenefits.cta.button}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}