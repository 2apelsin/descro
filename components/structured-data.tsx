export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Descro",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "199",
      "priceCurrency": "RUB",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "description": "Первый месяц со скидкой"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "AI-генератор создаёт продающие заголовки, описания и буллеты для карточек товаров за 10 секунд. Для Ozon, Wildberries, Яндекс Маркет.",
    "url": "https://descro-production.up.railway.app",
    "screenshot": "https://descro-production.up.railway.app/og-image.png",
    "featureList": [
      "Генерация описаний за 10 секунд",
      "Поддержка Ozon, Wildberries, Яндекс Маркет",
      "SEO-оптимизированные тексты",
      "3 бесплатные генерации в день",
      "Автоматические заголовки и буллеты"
    ]
  }

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Descro",
    "url": "https://descro-production.up.railway.app",
    "logo": "https://descro-production.up.railway.app/icon.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "descrosupport@gmail.com",
      "contactType": "Customer Support",
      "availableLanguage": "Russian"
    },
    "sameAs": []
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Сколько стоит Descro?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Первый месяц — 199₽ (скидка 33%), далее 299₽/месяц. Есть бесплатный тариф с 3 генерациями в день."
        }
      },
      {
        "@type": "Question",
        "name": "Для каких маркетплейсов подходит?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Descro создаёт описания для Ozon, Wildberries, Яндекс Маркет и других маркетплейсов."
        }
      },
      {
        "@type": "Question",
        "name": "Как быстро генерируются описания?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI создаёт полное описание товара за 10 секунд: заголовок, буллеты и описание."
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  )
}
