import { DemoForm } from "@/components/demo-form"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 md:px-6 md:pb-32 md:pt-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* Левая колонка */}
          <div className="space-y-8 text-white">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-white/90">Уже 150+ продавцов используют</span>
            </div>

            {/* Заголовок */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
                Описания товаров
                <br />
                <span className="text-white/60">за 10 секунд</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
                Вбиваете название и характеристики → получаете готовый текст. 
                Без копирайтера, без головной боли.
              </p>
            </div>

            {/* Цена на видном месте */}
            <div className="inline-flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 backdrop-blur-sm">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400">199 ₽</span>
                  <span className="text-lg text-white/50 line-through">299 ₽</span>
                </div>
                <div className="text-sm text-white/80">Первый месяц со скидкой</div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div>
                <div className="text-sm text-emerald-400 font-medium">-33%</div>
                <div className="text-xs text-white/60">Экономия 100₽</div>
              </div>
            </div>

            {/* Социальное доказательство */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold">10 сек</div>
                <div className="text-sm text-white/60">Генерация</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-white/60">Карточек в день</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div>
                <div className="text-3xl font-bold">3 блока</div>
                <div className="text-sm text-white/60">Готового текста</div>
              </div>
            </div>

            {/* Мини-отзывы */}
            <div className="space-y-3 pt-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <p className="text-sm text-white/80">"Сэкономил 5 часов в день на описаниях"</p>
                <p className="mt-1 text-xs text-white/50">— Продавец на Ozon</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <p className="text-sm text-white/80">"Продажи выросли на 20% после оптимизации"</p>
                <p className="mt-1 text-xs text-white/50">— Селлер на Wildberries</p>
              </div>
            </div>
          </div>

          {/* Правая колонка - форма */}
          <div className="lg:pl-8">
            <DemoForm />
          </div>
        </div>
      </div>
    </section>
  )
}
