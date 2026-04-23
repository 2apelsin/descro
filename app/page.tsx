import { SiteHeader } from "@/components/site-header"
import { ScrollProgress } from "@/components/scroll-progress"
import { Hero } from "@/components/hero"
import { LiveStats } from "@/components/live-stats"
import { BeforeAfter } from "@/components/before-after"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { DiscountTimer } from "@/components/discount-timer"
import { Pricing } from "@/components/pricing"
import { TrustBadges } from "@/components/trust-badges"
import { FAQ } from "@/components/faq"
import { FloatingCTA } from "@/components/floating-cta"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      <ScrollProgress />
      <SiteHeader />
      <LiveStats />
      <Hero />
      <BeforeAfter />
      <Features />
      <HowItWorks />
      <Testimonials />
      <DiscountTimer />
      <Pricing />
      <TrustBadges />
      <FAQ />
      <SiteFooter />
      <FloatingCTA />
    </main>
  )
}
