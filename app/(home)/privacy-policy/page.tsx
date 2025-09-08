'use client'

import { ClientNavigation as Navigation } from '@/components/ClientNavigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/contexts/LanguageContext'

export default function PrivacyPolicy() {
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
                {t.legal.privacy.backHome}
              </Link>
            </div>

            <h1>{t.legal.privacy.title}</h1>
            
            <div className="legal-intro bg-[#090909]/50 border border-[#202020] rounded-2xl p-8 mb-10">
              <div className="legal-intro-decoration"></div>
              <div className="legal-intro-content">
                <div>
                  <div className="legal-intro-header text-center mb-6">
                    <span className="legal-intro-company bg-[#D78E59] text-[#171717] px-3 py-1 rounded-full text-sm font-semibold">
                      {t.legal.privacy.intro.company}
                    </span>
                  </div>
                  <div className="legal-intro-text space-y-4">
                    <p className="legal-intro-primary text-xl font-semibold text-[#EDECF8]">
                      {t.legal.privacy.intro.primary}
                    </p>
                    <p className="legal-intro-secondary text-[#828288]">
                      {t.legal.privacy.intro.secondary}
                    </p>
                    <p className="legal-intro-tertiary text-[#828288]">
                      {t.legal.privacy.intro.tertiary}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="legal-toc bg-[#090909]/30 border border-[#202020] rounded-xl p-6 mb-8">
              <h2 className="legal-toc-title text-xl font-bold text-[#D78E59] mb-4">{t.legal.privacy.tableOfContents.title}</h2>
              <ul className="legal-toc-list space-y-2 text-[#EDECF8]">
                <li><a href="#definitions" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.definitions}</a></li>
                <li><a href="#audience-personal-information" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.audienceInfo}</a></li>
                <li><a href="#creator-personal-information" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.creatorInfo}</a></li>
                <li><a href="#brand-partner-data" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.brandPartnerData}</a></li>
                <li><a href="#how-we-share-your-information" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.howWeShare}</a></li>
                <li><a href="#cookies-and-tracking-technologies" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.cookies}</a></li>
                <li><a href="#data-security" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.dataSecurity}</a></li>
                <li><a href="#global-privacy-and-international-data-transfers" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.globalPrivacy}</a></li>
                <li><a href="#your-privacy-choices" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.privacyChoices}</a></li>
                <li><a href="#contact-us" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.contactUs}</a></li>
                <li><a href="#changes-to-this-privacy-policy" className="legal-toc-link hover:text-[#FFAA6C] transition-colors">{t.legal.privacy.tableOfContents.items.changes}</a></li>
              </ul>
            </div>

            <h2 id="definitions">{t.legal.privacy.sections.definitions.title}</h2>
            {t.legal.privacy.sections.definitions.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h2 id="audience-personal-information">{t.legal.privacy.sections.audienceInfo.title}</h2>
            <p>{t.legal.privacy.sections.audienceInfo.intro}</p>
            
            <h3>{t.legal.privacy.sections.audienceInfo.infoWeCollect.title}</h3>
            <ul>
              {t.legal.privacy.sections.audienceInfo.infoWeCollect.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.legal.privacy.sections.audienceInfo.howWeUse.title}</h3>
            <ul>
              {t.legal.privacy.sections.audienceInfo.howWeUse.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 id="creator-personal-information">{t.legal.privacy.sections.creatorInfo.title}</h2>
            <p>{t.legal.privacy.sections.creatorInfo.intro}</p>

            <h3>{t.legal.privacy.sections.creatorInfo.infoCreatorsShare.title}</h3>
            <ul>
              {t.legal.privacy.sections.creatorInfo.infoCreatorsShare.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.legal.privacy.sections.creatorInfo.sensitiveInfo.title}</h3>
            <p>{t.legal.privacy.sections.creatorInfo.sensitiveInfo.content}</p>

            <h2 id="brand-partner-data">{t.legal.privacy.sections.brandPartnerData.title}</h2>
            <p>{t.legal.privacy.sections.brandPartnerData.intro}</p>

            <h3>{t.legal.privacy.sections.brandPartnerData.whatBrandsReceive.title}</h3>
            <ul>
              {t.legal.privacy.sections.brandPartnerData.whatBrandsReceive.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>{t.legal.privacy.sections.brandPartnerData.whatBrandsDontReceive.title}</h3>
            <ul>
              {t.legal.privacy.sections.brandPartnerData.whatBrandsDontReceive.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h2 id="how-we-share-your-information">{t.legal.privacy.sections.howWeShare.title}</h2>
            <p>{t.legal.privacy.sections.howWeShare.intro}</p>

            <h3>{t.legal.privacy.sections.howWeShare.serviceProviders.title}</h3>
            <p>{t.legal.privacy.sections.howWeShare.serviceProviders.content}</p>

            <h3>{t.legal.privacy.sections.howWeShare.legalRequirements.title}</h3>
            <p>{t.legal.privacy.sections.howWeShare.legalRequirements.content}</p>

            <h2 id="cookies-and-tracking-technologies">{t.legal.privacy.sections.cookies.title}</h2>
            <p>{t.legal.privacy.sections.cookies.content}</p>

            <h2 id="data-security">{t.legal.privacy.sections.dataSecurity.title}</h2>
            <p>{t.legal.privacy.sections.dataSecurity.content}</p>

            <h2 id="global-privacy-and-international-data-transfers">{t.legal.privacy.sections.globalPrivacy.title}</h2>
            <p>{t.legal.privacy.sections.globalPrivacy.content}</p>

            <h2 id="your-privacy-choices">{t.legal.privacy.sections.privacyChoices.title}</h2>
            <p>{t.legal.privacy.sections.privacyChoices.content}</p>
            
            <h2 id="contact-us">{t.legal.privacy.sections.contactUs.title}</h2>
            <p>{t.legal.privacy.sections.contactUs.content}</p>
            <div className="legal-contact">
              <div className="legal-contact-content">
                <p className="legal-contact-company">
                  <strong>{t.legal.privacy.sections.contactUs.company}</strong>
                </p>
                <div className="legal-contact-details">
                  <p>{t.legal.privacy.sections.contactUs.email} <a href="mailto:ruslan.latsina@clicksi.io" className="legal-contact-link">ruslan.latsina@clicksi.io</a></p>
                  <p>{t.legal.privacy.sections.contactUs.email} <a href="mailto:tetiana.piatkovska@clicksi.io" className="legal-contact-link">tetiana.piatkovska@clicksi.io</a></p>
                  <p>{t.legal.privacy.sections.contactUs.address}</p>
                </div>
                <p className="legal-contact-note">
                  {t.legal.privacy.sections.contactUs.note}
                </p>
              </div>
            </div>

            <h2 id="changes-to-this-privacy-policy">{t.legal.privacy.sections.changes.title}</h2>
            <p>{t.legal.privacy.sections.changes.content}</p>

            <p className="text-sm text-[#828288] mt-12 pt-8 border-t border-[#202020]">
              {t.legal.privacy.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}