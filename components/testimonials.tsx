"use client"

import { Star, Play } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    name: "Алексей М.",
    role: "Продавец на Ozon",
    avatar: "AM",
    rating: 5,
    text: "Раньше тратил по 2 часа на описания 10 товаров. Теперь делаю 50 карточек за полчаса. Продажи выросли на 35% благодаря SEO-оптимизации.",
    stats: "50 карточек в день"
  },
  {
    name: "Мария К.",
    role: "Селлер на Wildberries",
    avatar: "МК",
    rating: 5,
    text: "Сэкономила кучу времени и денег на копирайтере. Описания получаются лучше, чем я сама писала. Особенно нравится, что учитываются лимиты маркетплейсов.",
    stats: "Экономия 15 000₽/мес"
  },
  {
    name: "Дмитрий П.",
    role: "Владелец магазина",
    avatar: "ДП",
    rating: 5,
    text: "У меня 3 сотрудника, которые раньше занимались описаниями. Теперь они переключились на более важные задачи. Descro окупился за первую неделю.",
    stats: "200+ товаров"
  },
  {
    name: "Елена С.",
    role: "Начинающий продавец",
    avatar: "ЕС",
    rating: 5,
    text: "Только начала продавать на маркетплейсах. Не знала, как правильно писать описания. Descro помог сделать профессиональные карточки с первого раза.",
    stats: "Первые продажи за 3 дня"
  },
  {
    name: "Игорь В.",
    role: "Оптовый поставщик",
    avatar: "ИВ",
    rating: 5,
    text: "Работаю с 500+ товарами. Descro — это спасение. Генерирую описания пачками, копирую в Excel и загружаю на все площадки сразу.",
    stats: "500+ товаров"
  },
  {
    name: "Анна Л.",
    role: "Продавец одежды",
    avatar: "АЛ",
    rating: 5,
    text: "Каждый день добавляю новые модели. Descro помогает быстро создавать уникальные описания, которые нравятся покупателям. Конверсия выросла.",
    stats: "+28% конверсия"
  }
]

export function Testimonials() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="border-t border-slate-200 bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Заголовок */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Что говорят продавцы
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Более 150 продавцов уже используют Descro для создания карточек товаров
          </p>
        </div>

        {/* Видео-инструкция */}
        <div className="mb-16">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {!showVideo ? (
                <div className="relative aspect-video cursor-pointer" onClick={() => setShowVideo(true)}>
                  {/* Превью */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-transform hover:scale-110">
                        <Play className="h-10 w-10 text-white" fill="white" />
                      </div>
                      <p className="text-lg font-medium text-white">Как пользоваться Descro</p>
                      <p className="mt-1 text-sm text-white/70">2 минуты</p>
                    </div>
                  </div>
                  {/* Скриншот интерфейса */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                      <div className="mb-2 h-2 w-32 rounded bg-white/20" />
                      <div className="mb-2 h-2 w-48 rounded bg-white/20" />
                      <div className="h-2 w-40 rounded bg-white/20" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 p-8">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="mb-6 text-6xl">🎬</div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Инструкция по использованию</h3>
                    <div className="max-w-md space-y-4 text-left text-white/80">
                      <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">1</div>
                        <p>Выберите маркетплейс (Ozon, Wildberries или Яндекс)</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">2</div>
                        <p>Введите название товара и основные характеристики</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">3</div>
                        <p>Нажмите "Сгенерировать" и получите готовое описание за 10 секунд</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">4</div>
                        <p>Скопируйте результат и вставьте в карточку товара</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowVideo(false)}
                      className="mt-6 text-sm text-white/60 hover:text-white/80"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Отзывы */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="card-3d rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-emerald-300"
            >
              {/* Рейтинг */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Текст отзыва */}
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                "{testimonial.text}"
              </p>

              {/* Статистика */}
              <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-center">
                <p className="text-sm font-semibold text-emerald-700">{testimonial.stats}</p>
              </div>

              {/* Автор */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Статистика */}
        <div className="mt-16 grid gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-slate-900">150+</div>
            <div className="text-sm text-slate-600">Активных продавцов</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-slate-900">5000+</div>
            <div className="text-sm text-slate-600">Карточек создано</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-slate-900">10 сек</div>
            <div className="text-sm text-slate-600">Средняя генерация</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-slate-900">4.9/5</div>
            <div className="text-sm text-slate-600">Средняя оценка</div>
          </div>
        </div>
      </div>
    </section>
  )
}
