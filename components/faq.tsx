"use client"

import { useState } from "react"

const faqs = [
  {
    q: "Подходит ли для Ozon, Wildberries и Яндекс Маркет?",
    a: "Да, алгоритм заточен под требования этих маркетплейсов. Учитываем ограничения по символам и SEO-требования.",
  },
  {
    q: "Нужна ли регистрация?",
    a: "Нет, вы можете сгенерировать 3 описания в день без регистрации. Просто заполните форму.",
  },
  {
    q: "Как оплатить Pro?",
    a: "Оплата через СБП, карты российских банков. После оплаты получаете безлимитный доступ на месяц.",
  },
  {
    q: "Можно ли редактировать текст?",
    a: "Конечно! Descro создаёт готовую основу, которую можно скопировать и отредактировать.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-slate-50 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Частые вопросы
          </h2>
          <p className="text-lg text-slate-600">
            Ответы на популярные вопросы о Descro
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-slate-900">{faq.q}</span>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Не нашли ответ?{" "}
          <a href="mailto:hello@descro.ru" className="font-medium text-slate-900 hover:underline">
            Напишите нам
          </a>
        </p>
      </div>
    </section>
  )
}
