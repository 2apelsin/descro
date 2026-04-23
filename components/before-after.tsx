"use client"

import { useState } from "react"
import { ArrowRight, X, Check } from "lucide-react"

const comparisons = [
  {
    before: "Наушники беспроводные, хорошие, звук чистый",
    after: "Беспроводные TWS-наушники с активным шумоподавлением ANC и 30-часовой автономностью. Bluetooth 5.3 обеспечивает стабильное соединение до 10 метров. Влагозащита IPX7 позволяет использовать во время тренировок.",
    bullets: [
      "Активное шумоподавление ANC",
      "30 часов автономной работы",
      "Bluetooth 5.3 с быстрым подключением",
      "Влагозащита IPX7",
      "Быстрая зарядка за 15 минут"
    ]
  },
  {
    before: "Кроссовки мужские белые 42",
    after: "Мужские кроссовки для бега с дышащим сетчатым верхом и амортизирующей подошвой. Размер 42, белый цвет. Идеально подходят для ежедневных пробежек и тренировок в зале.",
    bullets: [
      "Дышащий сетчатый материал",
      "Амортизирующая подошва EVA",
      "Размер 42, белый цвет",
      "Подходят для бега и тренировок",
      "Легкий вес — всего 280 грамм"
    ]
  },
]

export function BeforeAfter() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAfter, setShowAfter] = useState(false)

  const active = comparisons[activeIndex]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Обычное описание vs AI
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Нажмите на кнопку, чтобы увидеть разницу между обычным и AI-описанием
          </p>
        </div>

        {/* Переключатель примеров */}
        <div className="mb-8 flex justify-center gap-2">
          {comparisons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveIndex(idx)
                setShowAfter(false)
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeIndex === idx
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Пример {idx + 1}
            </button>
          ))}
        </div>

        {/* Интерактивное сравнение */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50">
          {/* До */}
          <div className={`transition-all duration-500 ${showAfter ? "opacity-0" : "opacity-100"}`}>
            <div className="p-8 md:p-12">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Обычное описание
                </span>
              </div>
              
              <div className="mb-6 rounded-xl border border-red-200 bg-white p-6">
                <p className="text-lg italic text-slate-600">"{active.before}"</p>
              </div>

              <div className="mb-6 space-y-2">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <X className="h-4 w-4 text-red-500" /> Нет ключевых слов для поиска
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <X className="h-4 w-4 text-red-500" /> Не раскрывает преимущества
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-500">
                  <X className="h-4 w-4 text-red-500" /> Не продаёт товар
                </p>
              </div>

              <button
                onClick={() => setShowAfter(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-medium text-white transition-colors hover:bg-slate-800"
              >
                Улучшить с помощью AI
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* После */}
          {showAfter && (
            <div className="absolute inset-0 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="h-full overflow-auto p-8 md:p-12">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    AI-описание от Descro
                  </span>
                </div>

                {/* Заголовок */}
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700">
                    Заголовок
                  </div>
                  <p className="font-semibold text-slate-900">{active.after.split('.')[0]}</p>
                </div>

                {/* Буллеты */}
                <div className="mb-4 rounded-xl border border-emerald-200 bg-white p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-emerald-700">
                    Преимущества
                  </div>
                  <ul className="space-y-1.5">
                    {active.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Описание */}
                <div className="mb-6 rounded-xl border border-emerald-200 bg-white p-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-700">
                    Описание
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{active.after}</p>
                </div>

                <div className="mb-6 space-y-2">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500" /> SEO-оптимизация для поиска
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500" /> Все преимущества раскрыты
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500" /> Продающий текст готов
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAfter(false)}
                    className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 py-4 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Показать "До"
                  </button>
                  <a
                    href="#demo"
                    className="flex-1 rounded-xl bg-emerald-500 px-6 py-4 text-center font-medium text-white transition-colors hover:bg-emerald-600"
                  >
                    Попробовать
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Статистика улучшения */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-emerald-600">+250%</div>
            <div className="text-sm text-slate-600">Больше ключевых слов</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-emerald-600">10 сек</div>
            <div className="text-sm text-slate-600">Вместо 30 минут</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
            <div className="mb-2 text-3xl font-bold text-emerald-600">+35%</div>
            <div className="text-sm text-slate-600">Рост конверсии</div>
          </div>
        </div>
      </div>
    </section>
  )
}
