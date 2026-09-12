import { Suspense, lazy } from 'react'
import Header from '@/components/Header'
import MenuBrowser from '@/sections/MenuBrowser'
import Planner from '@/sections/Planner'
import VisitSection, { Footer } from '@/sections/VisitSection'
import { PlannerProvider } from '@/state/PlannerContext'

// 3D hero is code-split so three.js doesn't block first paint
const Hero3D = lazy(() => import('@/sections/Hero3D'))

function HeroFallback() {
  return (
    <section className="flex h-[92vh] min-h-[620px] items-center justify-center bg-gradient-to-b from-background via-card to-background">
      <div className="text-center">
        <h1 className="font-display text-5xl sm:text-7xl">
          <span className="block">CHILL AT</span>
          <span className="text-glow block text-primary">BOUNDARY</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Warming up the floodlights…</p>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <PlannerProvider>
      <div id="top" className="min-h-screen bg-background">
        <Header />
        <main>
          <Suspense fallback={<HeroFallback />}>
            <Hero3D />
          </Suspense>
          <MenuBrowser />
          <Planner />
          <VisitSection />
        </main>
        <Footer />
      </div>
    </PlannerProvider>
  )
}
