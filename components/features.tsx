const features = [
  {
    title: "Заголовок",
    description: "SEO-заголовок с ключевыми словами для поиска маркетплейса",
    example: "Беспроводные наушники TWS Pro с шумоподавлением, 36 часов работы",
  },
  {
    title: "Буллеты",
    description: "Список преимуществ для карточки товара",
    example: ["Активное шумоподавление ANC", "До 36 часов работы", "Быстрая зарядка"],
  },
  {
    title: "Описание",
    description: "Продающий текст, который повышает конверсию",
    example: "Наслаждайтесь чистым звуком: активное шумоподавление, 36 часов работы и удобная посадка.",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Три блока для карточки
          </h2>
          <p className="text-lg text-slate-600">
            Вставляйте результат напрямую в личный кабинет маркетплейса
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={feature.title} 
              className="card-3d rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600">
                <span className="text-2xl font-bold text-white">{idx + 1}</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mb-4 text-sm text-slate-600">{feature.description}</p>
              
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-emerald-700">
                  Пример
                </div>
                {Array.isArray(feature.example) ? (
                  <ul className="space-y-1.5">
                    {feature.example.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-700">{feature.example}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
