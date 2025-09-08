import { Navigation } from '@/components/navigation'
import { FAQ } from '@/components/faq'

export default function FAQPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <FAQ />
      </main>
    </>
  )
}