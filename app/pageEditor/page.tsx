'use client'

import { PageEditor } from '@/components/pageEditor/PageEditor'
import { useTranslation } from '@/contexts/LanguageContext'
import { ContentNode } from '@/lib/content-converter'

export default function EditorPage() {
  
  const handleSave = async (content: { html: string; text: string; json: ContentNode[] }) => {
    // For now, just log the content. 
    // In a real implementation, you'd save this to a database or file
    console.log('Saving content:', content)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Show success message in a more user-friendly way
    console.log('Content saved! (This is a demo - check console for actual content)')
    // You could replace this with a toast notification or other UI feedback
  }

  const loadPrivacyContentAsText = () => {
    // Return the exact content from privacy.txt
    return `Privacy Policy

CLICKSI TECHNOLOGIES INC. • UKRAINE-BASED COMPANY

At CLICKSI, we believe creators and their audiences deserve clarity, control, and trust.

Whether you're browsing a Creator's curated feed or sharing affiliate links that drive revenue, we're committed to safeguarding your personal information and providing you with the tools to manage it.

This Privacy Statement explains how CLICKSI collects, uses, and shares your personal data—whether you're a Creator, a fan, or a Brand partner. Our goal is to be transparent, easy to understand, and compliant with global privacy standards.

Table of Contents:
1. Definitions
2. Audience Personal Information
3. Creator Personal Information
4. Brand Partner Data
5. How We Share Your Information
6. Cookies and Tracking Technologies
7. Data Security
8. Global Privacy and International Data Transfers
9. Your Privacy Choices
10. Contact Us
11. Changes to This Privacy Policy

1. Definitions
When we refer to "CLICKSI," "we," "our," or "us," we mean CLICKSI Technologies Inc., a Ukraine-based company developing the CLICKSI Platform. When we mention our "Services," we're referring to the features, content, websites, mobile applications, and technologies provided by CLICKSI that enable creators, brands, and audiences to engage in affiliate marketing, content sharing, social commerce, performance analytics, and monetization.

"Personal information" refers to any information that identifies, relates to, or could reasonably be linked to a living individual or their household. It includes things like your name, email address, device ID, or account activity, but does not include anonymized or aggregated data that cannot reasonably be used to identify you.

2. Audience Personal Information
Whether you're discovering new content, exploring Creator profiles, or clicking through to a Brand's product page, we collect and use certain information to improve your experience and track performance. Some of this information is collected automatically and used to make recommendations or reward Creators via affiliate links.

Information We Collect:
• Device and browser information
• IP address and general location
• Clickstream and referral data
• Interaction behavior (clicks on links, time spent on pages)
• Account information (if you create an account)
• Contact information (email, phone number)
• Profile preferences and settings

How We Use This Information:
• Deliver the content and Services you're looking for
• Provide personalized recommendations and link previews
• Attribution engagement to the appropriate Creator
• Ensure commissions are properly tracked and reported
• Prevent fraud or misuse of our Services

3. Creator Personal Information
CLICKSI empowers Creators to share, grow, and earn. As a Creator, we collect personal information to support your engagement, partnerships, and affiliate marketing efforts. This includes activity from CLICKSI-hosted profiles and any tracked engagement across external channels via CLICKSI links.

Information Creators Share:
• Application and contact information (name, email, phone)
• Social media handles and platform links
• Profile and demographic information
• Payment and payout details (via secure third-party processors)
• Content uploads (photos, videos, recordings)
• Campaign and collaboration data
• Performance metrics and analytics

Sensitive Information
During profile creation, you may choose to share sensitive information such as race, ethnicity, gender, style, body type, and areas of expertise. This is optional and used only to match you with relevant campaigns and recommendations. We may also require identity verification documents for tax and compliance purposes.

4. Brand Partner Data
We provide our Brand partners with performance insights—but not personal data of users. Our platform shares aggregated data on Creator activity to help Brands understand impact without compromising user privacy.

What Brands Receive:
• Public profile information of Creators
• Performance data for specific campaigns
• Content featuring your products
• Campaign effectiveness metrics

What Brands Don't Receive:
• Personal information of audience members
• Full browsing data or behavioral profiles
• Creator payout details
• Platform-wide analytics beyond their campaigns

5. How We Share Your Information
To provide you with our services and enhance your experience, we do share some of your personal information in specific circumstances:

Service Providers
We work with trusted third-party service providers to deliver our Services, including payment processors, analytics providers, and hosting services. These partners only access information necessary to perform their functions.

Legal Requirements
We may disclose your information if required by law or in response to legal processes, including compliance with court orders, subpoenas, or regulatory investigations.

6. Cookies and Tracking Technologies
We use cookies and similar technologies to improve your experience, analyze usage patterns, and track affiliate link performance. You can control cookie preferences through your browser settings.

7. Data Security
We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.

8. Global Privacy and International Data Transfers
As a Ukraine-based company serving users globally, we may transfer your data across borders. We ensure appropriate safeguards are in place for such transfers in compliance with applicable privacy laws.

9. Your Privacy Choices
You have rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data. Contact us to exercise these rights or adjust your privacy preferences.

10. Contact Us
If you have questions about this Privacy Policy or would like to submit a data request, please contact us at:

CLICKSI Technologies Inc.
Email: ruslan.latsina@clicksi.io
Email: tetiana.piatkovska@clicksi.io
Address: Ukraine

We aim to respond promptly to all inquiries.

11. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and, if you have an account, by sending you an email notification.

Last updated: January 2025
`
  }

  const loadPrivacyContentAsHtml = () => {
    // Return the exact content from privacy.html
    return `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
  <!-- Privacy Policy Header -->
  <header style="text-align: center; padding: 4rem 0;">
    <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem; color: #EDECF8;">
      Privacy Policy
    </h1>
    
    <!-- Company Badge -->
    <div style="background: #090909; border: 1px solid #202020; border-radius: 1rem; padding: 2rem; margin-bottom: 2rem;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span style="background: #D78E59; color: #171717; padding: 0.75rem 1.5rem; border-radius: 2rem; font-size: 0.875rem; font-weight: bold;">
          CLICKSI TECHNOLOGIES INC. • UKRAINE-BASED COMPANY
        </span>
      </div>
      <p style="font-size: 1.25rem; font-weight: bold; color: #EDECF8; margin-bottom: 1rem;">
        At CLICKSI, we believe creators and their audiences deserve clarity, control, and trust.
      </p>
      <p style="color: #828288; margin-bottom: 1rem; line-height: 1.6;">
        Whether you're browsing a Creator's curated feed or sharing affiliate links that drive revenue, we're committed to safeguarding your personal information and providing you with the tools to manage it.
      </p>
      <p style="color: #828288; line-height: 1.6;">
        This Privacy Statement explains how CLICKSI collects, uses, and shares your personal data—whether you're a Creator, a fan, or a Brand partner. Our goal is to be transparent, easy to understand, and compliant with global privacy standards.
      </p>
    </div>
  </header>

  <!-- Table of Contents -->
  <section style="background: #090909; border: 1px solid #202020; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem;">
    <h2 style="color: #D78E59; font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem;">
      Table of Contents
    </h2>
    <ul style="color: #EDECF8; line-height: 1.8; margin: 0; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;"><a href="#section-1" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Definitions</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-2" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Audience Personal Information</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-3" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Creator Personal Information</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-4" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Brand Partner Data</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-5" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">How We Share Your Information</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-6" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Cookies and Tracking Technologies</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-7" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Data Security</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-8" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Global Privacy and International Data Transfers</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-9" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Your Privacy Choices</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-10" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Contact Us</a></li><li style="margin-bottom: 0.5rem;"><a href="#section-11" style="color: #EDECF8; text-decoration: none; transition: color 0.3s;">Changes to This Privacy Policy</a></li>
    </ul>
  </section>

  <!-- Section 1: Definitions -->
  <section id="section-1" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      1. Definitions
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">When we refer to "CLICKSI," "we," "our," or "us," we mean CLICKSI Technologies Inc., a Ukraine-based company developing the CLICKSI Platform. When we mention our "Services," we're referring to the features, content, websites, mobile applications, and technologies provided by CLICKSI that enable creators, brands, and audiences to engage in affiliate marketing, content sharing, social commerce, performance analytics, and monetization.</p><p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">"Personal information" refers to any information that identifies, relates to, or could reasonably be linked to a living individual or their household. It includes things like your name, email address, device ID, or account activity, but does not include anonymized or aggregated data that cannot reasonably be used to identify you.</p>
  </section>

  <!-- Section 2: Audience Information -->
  <section id="section-2" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      2. Audience Personal Information
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem;">
      Whether you're discovering new content, exploring Creator profiles, or clicking through to a Brand's product page, we collect and use certain information to improve your experience and track performance. Some of this information is collected automatically and used to make recommendations or reward Creators via affiliate links.
    </p>
    
    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      Information We Collect
    </h3>
    <ul style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;">Device and browser information</li><li style="margin-bottom: 0.5rem;">IP address and general location</li><li style="margin-bottom: 0.5rem;">Clickstream and referral data</li><li style="margin-bottom: 0.5rem;">Interaction behavior (clicks on links, time spent on pages)</li><li style="margin-bottom: 0.5rem;">Account information (if you create an account)</li><li style="margin-bottom: 0.5rem;">Contact information (email, phone number)</li><li style="margin-bottom: 0.5rem;">Profile preferences and settings</li>
    </ul>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      How We Use This Information
    </h3>
    <ul style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;">Deliver the content and Services you're looking for</li><li style="margin-bottom: 0.5rem;">Provide personalized recommendations and link previews</li><li style="margin-bottom: 0.5rem;">Attribution engagement to the appropriate Creator</li><li style="margin-bottom: 0.5rem;">Ensure commissions are properly tracked and reported</li><li style="margin-bottom: 0.5rem;">Prevent fraud or misuse of our Services</li>
    </ul>
  </section>

  <!-- Section 3: Creator Information -->
  <section id="section-3" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      3. Creator Personal Information
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem;">
      CLICKSI empowers Creators to share, grow, and earn. As a Creator, we collect personal information to support your engagement, partnerships, and affiliate marketing efforts. This includes activity from CLICKSI-hosted profiles and any tracked engagement across external channels via CLICKSI links.
    </p>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      Information Creators Share
    </h3>
    <ul style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;">Application and contact information (name, email, phone)</li><li style="margin-bottom: 0.5rem;">Social media handles and platform links</li><li style="margin-bottom: 0.5rem;">Profile and demographic information</li><li style="margin-bottom: 0.5rem;">Payment and payout details (via secure third-party processors)</li><li style="margin-bottom: 0.5rem;">Content uploads (photos, videos, recordings)</li><li style="margin-bottom: 0.5rem;">Campaign and collaboration data</li><li style="margin-bottom: 0.5rem;">Performance metrics and analytics</li>
    </ul>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      Sensitive Information
    </h3>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      During profile creation, you may choose to share sensitive information such as race, ethnicity, gender, style, body type, and areas of expertise. This is optional and used only to match you with relevant campaigns and recommendations. We may also require identity verification documents for tax and compliance purposes.
    </p>
  </section>

  <!-- Section 4: Brand Partner Data -->
  <section id="section-4" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      4. Brand Partner Data
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem;">
      We provide our Brand partners with performance insights—but not personal data of users. Our platform shares aggregated data on Creator activity to help Brands understand impact without compromising user privacy.
    </p>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      What Brands Receive
    </h3>
    <ul style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;">Public profile information of Creators</li><li style="margin-bottom: 0.5rem;">Performance data for specific campaigns</li><li style="margin-bottom: 0.5rem;">Content featuring your products</li><li style="margin-bottom: 0.5rem;">Campaign effectiveness metrics</li>
    </ul>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      What Brands Don't Receive
    </h3>
    <ul style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem; padding-left: 1.5rem;">
      <li style="margin-bottom: 0.5rem;">Personal information of audience members</li><li style="margin-bottom: 0.5rem;">Full browsing data or behavioral profiles</li><li style="margin-bottom: 0.5rem;">Creator payout details</li><li style="margin-bottom: 0.5rem;">Platform-wide analytics beyond their campaigns</li>
    </ul>
  </section>

  <!-- Section 5: How We Share -->
  <section id="section-5" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      5. How We Share Your Information
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem;">
      To provide you with our services and enhance your experience, we do share some of your personal information in specific circumstances:
    </p>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      Service Providers
    </h3>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1.5rem;">
      We work with trusted third-party service providers to deliver our Services, including payment processors, analytics providers, and hosting services. These partners only access information necessary to perform their functions.
    </p>

    <h3 style="color: #D78E59; font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">
      Legal Requirements
    </h3>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      We may disclose your information if required by law or in response to legal processes, including compliance with court orders, subpoenas, or regulatory investigations.
    </p>
  </section>

  <!-- Remaining Sections -->
  <section id="section-6" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      6. Cookies and Tracking Technologies
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      We use cookies and similar technologies to improve your experience, analyze usage patterns, and track affiliate link performance. You can control cookie preferences through your browser settings.
    </p>
  </section>

  <section id="section-7" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      7. Data Security
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
    </p>
  </section>

  <section id="section-8" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      8. Global Privacy and International Data Transfers
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      As a Ukraine-based company serving users globally, we may transfer your data across borders. We ensure appropriate safeguards are in place for such transfers in compliance with applicable privacy laws.
    </p>
  </section>

  <section id="section-9" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      9. Your Privacy Choices
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      You have rights regarding your personal information, including the right to access, correct, delete, or restrict processing of your data. Contact us to exercise these rights or adjust your privacy preferences.
    </p>
  </section>

  <!-- Contact Section -->
  <section id="section-10" style="background: #090909; border: 1px solid #202020; border-radius: 1rem; padding: 2rem; margin-bottom: 3rem; text-align: center;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
      10. Contact Us
    </h2>
    <p style="color: #828288; margin-bottom: 1.5rem; font-size: 1.1rem;">
      If you have questions about this Privacy Policy or would like to submit a data request, please contact us at:
    </p>
    <div style="background: #171717; border-radius: 0.5rem; padding: 1.5rem; margin: 1.5rem 0;">
      <p style="color: #EDECF8; font-weight: bold; margin-bottom: 1rem;">
        CLICKSI Technologies Inc.
      </p>
      <p style="color: #828288; margin-bottom: 0.5rem;">
        Email: <a href="mailto:ruslan.latsina@clicksi.io" style="color: #D78E59; text-decoration: none;">ruslan.latsina@clicksi.io</a>
      </p>
      <p style="color: #828288; margin-bottom: 0.5rem;">
        Email: <a href="mailto:tetiana.piatkovska@clicksi.io" style="color: #D78E59; text-decoration: none;">tetiana.piatkovska@clicksi.io</a>
      </p>
      <p style="color: #828288; margin-bottom: 1rem;">
        Address: Ukraine
      </p>
      <p style="color: #828288; font-size: 0.9rem; font-style: italic;">
        We aim to respond promptly to all inquiries.
      </p>
    </div>
  </section>

  <!-- Changes Section -->
  <section id="section-11" style="margin-bottom: 3rem;">
    <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1.5rem;">
      11. Changes to This Privacy Policy
    </h2>
    <p style="color: #828288; line-height: 1.6; margin-bottom: 1rem;">
      We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and, if you have an account, by sending you an email notification.
    </p>
  </section>

  <!-- Footer -->
  <footer style="text-align: center; padding: 2rem 0; border-top: 1px solid #202020; margin-top: 3rem;">
    <p style="color: #828288; font-size: 0.875rem;">
      Last updated: January 2025
    </p>
  </footer>
</div>`
  }

  const loadLandingPageContent = () => {
    return `<div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
    <!-- Hero Section -->
    <header style="text-align: center; padding: 4rem 0;">
      <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem; color: #EDECF8;">
        Welcome to Our Amazing Service
      </h1>
      <p style="font-size: 1.25rem; color: #828288; margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
        Discover the future of digital solutions with our innovative platform designed to transform your business.
      </p>
      <a href="#contact" style="display: inline-block; background: #D78E59; color: #171717; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold; font-size: 1.1rem;">
        Get Started Today
      </a>
    </header>

    <!-- Features Section -->
    <section style="padding: 4rem 0;">
      <h2 style="text-align: center; font-size: 2.5rem; font-weight: bold; margin-bottom: 3rem; color: #EDECF8;">
        Why Choose Us?
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="background: #171717; padding: 2rem; border-radius: 1rem; border: 1px solid #202020;">
          <h3 style="color: #D78E59; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            ⚡ Lightning Fast
          </h3>
          <p style="color: #828288; line-height: 1.6;">
            Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology.
          </p>
        </div>
        <div style="background: #171717; padding: 2rem; border-radius: 1rem; border: 1px solid #202020;">
          <h3 style="color: #D78E59; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            🔒 Secure & Reliable
          </h3>
          <p style="color: #828288; line-height: 1.6;">
            Your data is protected with enterprise-grade security and 99.9% uptime guarantee.
          </p>
        </div>
        <div style="background: #171717; padding: 2rem; border-radius: 1rem; border: 1px solid #202020;">
          <h3 style="color: #D78E59; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">
            🎯 Easy to Use
          </h3>
          <p style="color: #828288; line-height: 1.6;">
            Intuitive interface designed for both beginners and professionals. Get started in minutes.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" style="background: #090909; padding: 4rem 2rem; border-radius: 1rem; text-align: center; margin-top: 4rem;">
      <h2 style="color: #EDECF8; font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">
        Ready to Get Started?
      </h2>
      <p style="color: #828288; margin-bottom: 2rem; font-size: 1.1rem;">
        Join thousands of satisfied customers who trust our platform.
      </p>
      <a href="mailto:hello@example.com" style="background: #D78E59; color: #171717; padding: 1rem 2rem; border-radius: 0.5rem; text-decoration: none; font-weight: bold;">
        Contact Us Now
      </a>
    </section>
  </div>`
  }

  // Combined function that returns content based on mode
  const loadPrivacyContent = (isHtmlMode: boolean) => {
    return isHtmlMode ? loadPrivacyContentAsHtml() : loadPrivacyContentAsText()
  }

  return (
    <PageEditor
      initialContent=""
      pageTitle="Document"
      onSave={handleSave}
      onLoadPrivacy={loadPrivacyContent}
      onLoadLandingPage={loadLandingPageContent}
    />
  )
}