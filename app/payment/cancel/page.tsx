import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-slate-100 p-4">
              <XCircle className="h-16 w-16 text-slate-600" />
            </div>
          </div>
          
          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Оплата отменена
          </h1>
          
          <p className="mb-8 text-lg text-slate-600">
            Вы отменили оплату. Попробуйте снова, когда будете готовы.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Попробовать снова
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-slate-50"
            >
              Вернуться на главную
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
