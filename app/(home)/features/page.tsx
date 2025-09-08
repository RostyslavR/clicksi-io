import { ClientNavigation as Navigation } from '@/components/ClientNavigation'
import { Features } from '@/components/features'

export default function FeaturesPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <Features />
      </main>
    </>
  )
}