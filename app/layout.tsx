import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Descro — Генератор описаний товаров для Ozon, Wildberries, Яндекс Маркет",
  description:
    "AI-генератор создаёт продающие заголовки, описания и буллеты для карточек товаров за 10 секунд. Без копирайтера. Бесплатно 3 генерации в день!",
  keywords: ["генератор описаний", "ozon", "wildberries", "яндекс маркет", "ai", "карточки товаров", "seo описания", "маркетплейсы"],
  authors: [{ name: "Descro" }],
  robots: "index, follow",
  openGraph: {
    title: "Descro — Описания товаров за 10 секунд",
    description: "AI-генератор для Ozon, Wildberries и Яндекс Маркет. Попробуйте бесплатно!",
    url: "https://descro-production.up.railway.app",
    siteName: "Descro",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Descro — Описания товаров за 10 секунд",
    description: "AI-генератор для маркетплейсов. Попробуйте бесплатно!",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
