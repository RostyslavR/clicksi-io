'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useTranslation } from '@/contexts/LanguageContext'

export function FAQ() {
  const { t } = useTranslation()

  return (
    <section id="faq" className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#090909] via-[#0F0F0F] to-[#171717]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#EDECF8] mb-8">{t.faq.title}</h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem 
            value="faq1"
            className="bg-[#090909] rounded-2xl border border-[#202020] px-6"
          >
            <AccordionTrigger className="text-left text-lg font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors py-6 hover:no-underline">
              {t.faq.questions.free.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#828288] pb-6">
              {t.faq.questions.free.answer}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem 
            value="faq2"
            className="bg-[#090909] rounded-2xl border border-[#202020] px-6"
          >
            <AccordionTrigger className="text-left text-lg font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors py-6 hover:no-underline">
              {t.faq.questions.earn.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#828288] pb-6">
              {t.faq.questions.earn.answer}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem 
            value="faq3"
            className="bg-[#090909] rounded-2xl border border-[#202020] px-6"
          >
            <AccordionTrigger className="text-left text-lg font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors py-6 hover:no-underline">
              {t.faq.questions.tracking.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#828288] pb-6">
              {t.faq.questions.tracking.answer}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem 
            value="faq4"
            className="bg-[#090909] rounded-2xl border border-[#202020] px-6"
          >
            <AccordionTrigger className="text-left text-lg font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors py-6 hover:no-underline">
              {t.faq.questions.beta.question}
            </AccordionTrigger>
            <AccordionContent className="text-[#828288] pb-6">
              {t.faq.questions.beta.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}