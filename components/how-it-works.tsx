const steps = [
  {
    number: "01",
    title: "Опишите товар",
    description: "Название, категория и характеристики. Даже короткий список подойдёт.",
  },
  {
    number: "02",
    title: "AI создаёт контент",
    description: "Подбираем ключевые слова и формируем готовые блоки текста.",
  },
  {
    number: "03",
    title: "Вставьте в карточку",
    description: "Копируйте и публикуйте на Ozon, Wildberries или Яндекс Маркет.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="bg-slate-900 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Как это работает
          </h2>
          <p className="text-lg text-white/70">
            Три простых шага от идеи до готовой карточки
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
