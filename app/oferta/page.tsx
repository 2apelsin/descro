import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function OfertaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 text-center">
          Публичная оферта (Договор)
        </h1>
        
        <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
          <div className="text-center text-sm text-slate-600 mb-8">
            <p><strong>Дата публикации:</strong> 24 апреля 2026 г.</p>
            <p><strong>Место публикации:</strong> descro-production.up.railway.app</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Термины и определения</h2>
            <div className="space-y-2 text-slate-700">
              <p><strong>Исполнитель</strong> — Аверьянов Илья Александрович, плательщик налога на профессиональный доход (самозанятый), ИНН 132610362688.</p>
              <p><strong>Заказчик</strong> — любое физическое или юридическое лицо, совершившее акцепт настоящей оферты.</p>
              <p><strong>Сервис</strong> — программный комплекс «Descro», доступный по адресу descro-production.up.railway.app.</p>
              <p><strong>Генерация</strong> — результат работы алгоритмов искусственного интеллекта по запросу Заказчика.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Акцепт оферты</h2>
            <div className="space-y-2 text-slate-700">
              <p>2.1. Использование Сервиса или совершение оплаты означает полное согласие с условиями настоящего Договора (ст. 438 ГК РФ).</p>
              <p>2.2. Если Заказчик не согласен с условиями, он обязан прекратить использование Сервиса.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Предмет договора</h2>
            <div className="space-y-2 text-slate-700">
              <p>3.1. Исполнитель предоставляет доступ к Сервису для генерации текстовых описаний товаров для маркетплейсов.</p>
              <p>3.2. Сервис предоставляется на условиях «как есть» (as is).</p>
              <p>3.3. Услуга предоставляется в электронном виде через веб-интерфейс.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Тарифы и стоимость</h2>
            <div className="space-y-2 text-slate-700">
              <p>4.1. Бесплатный тариф: 3 генерации в день.</p>
              <p>4.2. Тариф «PRO» (первый месяц): 199 рублей за 30 дней.</p>
              <p>4.3. Тариф «PRO» (обычная цена): 299 рублей за 30 дней.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Порядок оплаты</h2>
            <div className="space-y-2 text-slate-700">
              <p>5.1. Оплата производится через ЮKassa банковской картой.</p>
              <p>5.2. Доступ активируется автоматически после оплаты.</p>
              <p>5.3. Возможно автопродление подписки.</p>
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Ограничение ответственности (ВАЖНО)</h2>
            <div className="space-y-2 text-slate-700">
              <p><strong>6.1. Специфика ИИ:</strong> Тексты генерируются искусственным интеллектом. Исполнитель не несет ответственности за:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Фактические ошибки в тексте</li>
                <li>Стилистические несоответствия</li>
                <li>Блокировку карточек на маркетплейсах</li>
              </ul>
              <p><strong>6.2. Проверка текста:</strong> Заказчик обязан самостоятельно проверять текст перед публикацией.</p>
              <p><strong>6.3.</strong> Максимальная ответственность ограничена стоимостью тарифа.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Интеллектуальная собственность</h2>
            <div className="space-y-2 text-slate-700">
              <p>7.1. Права на Сервис принадлежат Исполнителю.</p>
              <p>7.2. Права на сгенерированные тексты принадлежат Заказчику.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Политика возврата</h2>
            <div className="space-y-2 text-slate-700">
              <p>8.1. Возврат после использования генераций не производится (ст. 32 Закона о защите прав потребителей).</p>
              <p>8.2. Возврат возможен в течение 24 часов при отсутствии использования.</p>
              <p>8.3. Технические сбои рассматриваются индивидуально: descrosupport@gmail.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Персональные данные</h2>
            <div className="space-y-2 text-slate-700">
              <p>9.1. Обработка данных согласно ФЗ-152 «О персональных данных».</p>
              <p>9.2. Данные не передаются третьим лицам.</p>
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Реквизиты исполнителя</h2>
            <div className="space-y-1 text-slate-700">
              <p><strong>ФИО:</strong> Аверьянов Илья Александрович</p>
              <p><strong>ИНН:</strong> 132610362688</p>
              <p><strong>Статус:</strong> Самозанятый</p>
              <p><strong>Email:</strong> descrosupport@gmail.com</p>
            </div>
          </section>

          <div className="text-center text-sm text-slate-500 pt-6">
            <p>Полная версия: <a href="/oferta.html" target="_blank" className="text-blue-600 hover:underline">oferta.html</a></p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
