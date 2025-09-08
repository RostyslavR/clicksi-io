import { Navigation } from '@/components/navigation'
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