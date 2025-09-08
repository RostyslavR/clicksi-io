import { ClientNavigation as Navigation } from '@/components/ClientNavigation'
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