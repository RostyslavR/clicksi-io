'use client'

import { Navigation } from '@/components/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/contexts/LanguageContext'

export default function TermsOfService() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <div className="bg-[#171717] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-invert prose-lg max-w-none 
            prose-h1:text-5xl prose-h1:font-bold prose-h1:mb-8
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-10
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-4
            prose-p:leading-relaxed prose-p:mb-6
            prose-ul:mb-6 prose-ul:space-y-2
            prose-a:no-underline hover:prose-a:text-[#FFAA6C]
          ">
            <div className="mb-8">
              <Link href="/" className="flex items-center text-[#828288] hover:text-[#EDECF8] transition-colors text-sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t.legal.terms.backHome}
              </Link>
            </div>

            <h1>{t.legal.terms.title}</h1>
            
            <div className="legal-intro bg-[#090909]/50 border border-[#202020] rounded-2xl p-8 mb-10">
              <div className="legal-intro-decoration"></div>
              <div className="legal-intro-content">
                <div className="legal-intro-header text-center mb-6">
                  <span className="legal-intro-company bg-[#D78E59] text-[#171717] px-3 py-1 rounded-full text-sm font-semibold">
                    {t.legal.terms.intro.company}
                  </span>
                </div>
                <div className="legal-intro-text space-y-4">
                  <p className="legal-intro-primary text-xl font-semibold text-[#EDECF8]">
                    {t.legal.terms.intro.primary}
                  </p>
                  <p className="legal-intro-secondary text-[#828288]">
                    {t.legal.terms.intro.secondary}
                  </p>
                  <p className="legal-intro-tertiary text-[#828288]">
                    {t.legal.terms.intro.tertiary}
                  </p>
                </div>
              </div>
            </div>

            <div className="legal-toc bg-[#090909]/30 border border-[#202020] rounded-xl p-6 mb-8">
              <h2 className="legal-toc-title text-xl font-bold text-[#D78E59] mb-4">{t.legal.terms.tableOfContents.title}</h2>
              <ul className="legal-toc-list space-y-2 text-[#EDECF8]">
                <li><a href="#introduction" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">1. {t.legal.terms.tableOfContents.items.introduction}</a></li>
                <li><a href="#service-availability-and-termination" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">2. {t.legal.terms.tableOfContents.items.serviceAvailability}</a></li>
                <li><a href="#access-to-our-services" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">3. {t.legal.terms.tableOfContents.items.accessToServices}</a></li>
                <li><a href="#user-conduct" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">4. {t.legal.terms.tableOfContents.items.userConduct}</a></li>
                <li><a href="#content-and-intellectual-property" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">5. {t.legal.terms.tableOfContents.items.contentAndIP}</a></li>
                <li><a href="#payments-and-fees" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">6. {t.legal.terms.tableOfContents.items.paymentsAndFees}</a></li>
                <li><a href="#disclaimers-and-limitations" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">7. {t.legal.terms.tableOfContents.items.disclaimers}</a></li>
                <li><a href="#assignment" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">8. {t.legal.terms.tableOfContents.items.assignment}</a></li>
                <li><a href="#no-warranties-disclaimers" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">9. {t.legal.terms.tableOfContents.items.noWarranties}</a></li>
                <li><a href="#limitation-of-liability" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">10. {t.legal.terms.tableOfContents.items.limitationLiability}</a></li>
                <li><a href="#indemnification" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">11. {t.legal.terms.tableOfContents.items.indemnification}</a></li>
                <li><a href="#arbitration-governing-law-dispute-resolution-and-class-action-waiver" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">12. {t.legal.terms.tableOfContents.items.arbitration}</a></li>
                <li><a href="#general-terms" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">13. {t.legal.terms.tableOfContents.items.generalTerms}</a></li>
                <li><a href="#contacting-us" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">14. {t.legal.terms.tableOfContents.items.contactUs}</a></li>
              </ul>
            </div>

            <h2 id="introduction">{t.legal.terms.sections.introduction.title}</h2>
            
            <h3>{t.legal.terms.sections.introduction.contract.title}</h3>
            {t.legal.terms.sections.introduction.contract.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h3>{t.legal.terms.sections.introduction.ourServices.title}</h3>
            {t.legal.terms.sections.introduction.ourServices.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="service-availability-and-termination">{t.legal.terms.sections.serviceAvailability.title}</h2>
            {t.legal.terms.sections.serviceAvailability.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="access-to-our-services">{t.legal.terms.sections.accessToServices.title}</h2>
            <p>{t.legal.terms.sections.accessToServices.intro}</p>

            <h3>{t.legal.terms.sections.accessToServices.betaServices.title}</h3>
            {t.legal.terms.sections.accessToServices.betaServices.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h3>{t.legal.terms.sections.accessToServices.eligibility.title}</h3>
            <p>{t.legal.terms.sections.accessToServices.eligibility.content}</p>
            <ul>
              {t.legal.terms.sections.accessToServices.eligibility.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.legal.terms.sections.accessToServices.registration.title}</h3>
            {t.legal.terms.sections.accessToServices.registration.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="user-conduct">{t.legal.terms.sections.userConduct.title}</h2>
            <p>{t.legal.terms.sections.userConduct.intro}</p>
            <ul>
              {t.legal.terms.sections.userConduct.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 id="content-and-intellectual-property">{t.legal.terms.sections.contentAndIP.title}</h2>
            
            <h3>{t.legal.terms.sections.contentAndIP.userContent.title}</h3>
            <p>{t.legal.terms.sections.contentAndIP.userContent.content}</p>

            <h3>{t.legal.terms.sections.contentAndIP.platformContent.title}</h3>
            <p>{t.legal.terms.sections.contentAndIP.platformContent.content}</p>

            <h2 id="payments-and-fees">{t.legal.terms.sections.paymentsAndFees.title}</h2>
            
            <h3>{t.legal.terms.sections.paymentsAndFees.serviceFees.title}</h3>
            <p>{t.legal.terms.sections.paymentsAndFees.serviceFees.content}</p>
            <ul>
              {t.legal.terms.sections.paymentsAndFees.serviceFees.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.legal.terms.sections.paymentsAndFees.paymentTerms.title}</h3>
            <ul>
              {t.legal.terms.sections.paymentsAndFees.paymentTerms.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 id="disclaimers-and-limitations">{t.legal.terms.sections.disclaimers.title}</h2>
            <p>{t.legal.terms.sections.disclaimers.platformRole.intro}</p>

            <h2 id="assignment">{t.legal.terms.sections.assignment.title}</h2>
            {t.legal.terms.sections.assignment.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="no-warranties-disclaimers">{t.legal.terms.sections.noWarranties.title}</h2>
            {t.legal.terms.sections.noWarranties.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="limitation-of-liability">{t.legal.terms.sections.limitationLiability.title}</h2>
            {t.legal.terms.sections.limitationLiability.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="indemnification">{t.legal.terms.sections.indemnification.title}</h2>
            <p>{t.legal.terms.sections.indemnification.intro}</p>

            <h2 id="arbitration-governing-law-dispute-resolution-and-class-action-waiver">{t.legal.terms.sections.arbitration.title}</h2>
            <p>{t.legal.terms.sections.arbitration.notice}</p>

            <h2 id="general-terms">{t.legal.terms.sections.generalTerms.title}</h2>
            <p>{t.legal.terms.sections.generalTerms.forceMajeure.content}</p>

            <h2 id="contacting-us">{t.legal.terms.sections.contactUs.title}</h2>
            <p>{t.legal.terms.sections.contactUs.content}</p>
            <div className="legal-contact">
              <div className="legal-contact-content">
                <p className="legal-contact-company">
                  <strong>{t.legal.terms.sections.contactUs.company}</strong>
                </p>
                <div className="legal-contact-details">
                  <p>{t.legal.terms.sections.contactUs.email} <a href="mailto:ruslan.latsina@clicksi.io" className="legal-contact-link">ruslan.latsina@clicksi.io</a></p>
                  <p>{t.legal.terms.sections.contactUs.email} <a href="mailto:tetiana.piatkovska@clicksi.io" className="legal-contact-link">tetiana.piatkovska@clicksi.io</a></p>
                  <p>{t.legal.terms.sections.contactUs.address}</p>
                </div>
                <p className="legal-contact-note">
                  {t.legal.terms.sections.contactUs.note}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#828288] mt-12 pt-8 border-t border-[#202020]">
              {t.legal.terms.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}