import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-slate-900">Descro</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600">
              AI-генератор описаний для карточек товаров на Ozon, Wildberries и Яндекс Маркет
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Продукт</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="#features" className="hover:text-slate-900">
                  Возможности
                </Link>
              </li>
              <li>
                <Link href="#how" className="hover:text-slate-900">
                  Как работает
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-slate-900">
                  Тарифы
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-900">Контакты</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="mailto:descrosupport@gmail.com" className="hover:text-slate-900">
                  descrosupport@gmail.com
                </a>
              </li>
              <li>
                <Link href="/requisites" className="hover:text-slate-900">
                  Реквизиты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Descro. Все права защищены</p>
          <div className="flex gap-6">
            <Link href="/oferta" className="hover:text-slate-900">
              Оферта
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Конфиденциальность
            </Link>
            <Link href="/requisites" className="hover:text-slate-900">
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
