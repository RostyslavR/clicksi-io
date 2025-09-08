import { ClientNavigation as Navigation } from '@/components/ClientNavigation'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Features } from '@/components/features'
import { BetaBenefits } from '@/components/beta-benefits'
import { FAQ } from '@/components/faq'

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <About />
        <Features />
        <BetaBenefits />
        <FAQ />
      </main>
    </>
  )
}