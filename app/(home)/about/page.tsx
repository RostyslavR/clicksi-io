import { Navigation } from '@/components/navigation'
import { About } from '@/components/about'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="flex-grow">
        <About />
      </main>
    </>
  )
}