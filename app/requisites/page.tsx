import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"

export default function RequisitesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Реквизиты и контакты</h1>
        
        <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Исполнитель</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">ФИО</h3>
                <p className="text-lg text-slate-900">Аверьянов Илья Александрович</p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">ИНН</h3>
                <p className="text-lg text-slate-900">[Ваш ИНН]</p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">Статус</h3>
                <p className="text-lg text-slate-900">Самозанятый</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Контакты</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">Email</h3>
                <p className="text-lg text-slate-900">support@descro.ru</p>
              </div>

              <div>
                <h3 className="mb-1 text-sm font-medium text-slate-500">Telegram</h3>
                <p className="text-lg text-slate-900">@YOUR_TELEGRAM</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Способ получения услуги</h2>
            <p className="text-slate-700 leading-relaxed">
              После оплаты доступ к PRO-версии активируется автоматически в личном кабинете пользователя на сайте. 
              Физическая доставка не требуется. Услуга предоставляется в виде доступа к веб-сервису.
            </p>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Документы</h2>
            <Link 
              href="/oferta.pdf" 
              target="_blank"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 underline"
            >
              📄 Скачать договор оферты (PDF)
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
