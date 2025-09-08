import { Navigation } from '@/components/navigation'
import { BetaBenefits } from '@/components/beta-benefits'

export default function BetaBenefitsPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <BetaBenefits />
      </main>
    </>
  )
}