import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { YandexMetrika } from '@/components/yandex-metrika'
import { StructuredData } from '@/components/structured-data'
import './globals.css'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Descro — Генератор описаний товаров для Ozon, Wildberries, Яндекс Маркет | AI за 10 секунд",
  description:
    "⚡ AI-генератор создаёт продающие заголовки, описания и буллеты для карточек товаров за 10 секунд. Для Ozon, Wildberries, Яндекс Маркет. Бесплатно 3 генерации в день! Без копирайтера, без головной боли.",
  keywords: [
    "генератор описаний товаров",
    "описания для ozon",
    "описания для wildberries", 
    "описания для яндекс маркет",
    "ai генератор текстов",
    "карточки товаров",
    "seo описания товаров",
    "маркетплейсы",
    "автоматические описания",
    "нейросеть для описаний",
    "продающие тексты",
    "буллеты для товаров",
    "заголовки для карточек",
    "контент для маркетплейсов"
  ],
  authors: [{ name: "Descro" }],
  creator: "Descro",
  publisher: "Descro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Descro — Описания товаров за 10 секунд | AI-генератор для маркетплейсов",
    description: "AI-генератор для Ozon, Wildberries и Яндекс Маркет. Создаёт продающие описания, заголовки и буллеты за 10 секунд. Попробуйте бесплатно!",
    url: "https://descro-production.up.railway.app",
    siteName: "Descro",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://descro-production.up.railway.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Descro - Генератор описаний товаров для маркетплейсов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Descro — Описания товаров за 10 секунд",
    description: "AI-генератор для маркетплейсов. Попробуйте бесплатно!",
    images: ["https://descro-production.up.railway.app/og-image.png"],
  },
  alternates: {
    canonical: "https://descro-production.up.railway.app",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  verification: {
    // Яндекс Вебмастер
    yandex: '4f79fc537d4c7d48',
    // Google Search Console - добавь после регистрации
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} bg-background`}>
      <head>
        <StructuredData />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
        <YandexMetrika />
      </body>
    </html>
  )
}
