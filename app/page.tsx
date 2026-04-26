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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Descro',
    description: 'AI-генератор описаний товаров для маркетплейсов Ozon, Wildberries и Яндекс Маркет',
    url: 'https://descro-production.up.railway.app',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '199',
      priceCurrency: 'RUB',
      description: 'PRO подписка на 1 месяц',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </>
  )
}
