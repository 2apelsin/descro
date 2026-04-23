import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-white p-12 shadow-lg">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <CheckCircle className="h-16 w-16 text-emerald-600" />
            </div>
          </div>
          
          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Оплата прошла успешно!
          </h1>
          
          <p className="mb-8 text-lg text-slate-600">
            Спасибо за покупку! PRO доступ активирован.
          </p>
          
          <div className="mb-8 rounded-xl bg-emerald-50 p-6">
            <h2 className="mb-2 font-semibold text-emerald-900">Что дальше?</h2>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>✅ Безлимитные генерации описаний</li>
              <li>✅ История всех генераций</li>
              <li>✅ Приоритетная поддержка</li>
            </ul>
          </div>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
