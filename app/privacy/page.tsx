import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold text-slate-900 text-center">
          Политика конфиденциальности
        </h1>
        
        <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6">
          <div className="text-center text-sm text-slate-600 mb-8">
            <p><strong>Дата публикации:</strong> 24 апреля 2026 г.</p>
            <p><strong>Действует с:</strong> 24 апреля 2026 г.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Общие положения</h2>
            <div className="space-y-2 text-slate-700">
              <p>1.1. Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса «Descro» (далее — Сервис).</p>
              <p>1.2. Оператор персональных данных: Аверьянов Илья Александрович, ИНН 132610362688.</p>
              <p>1.3. Использование Сервиса означает согласие пользователя с настоящей Политикой конфиденциальности.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Какие данные мы собираем</h2>
            <div className="space-y-2 text-slate-700">
              <p>2.1. При использовании Сервиса мы можем собирать следующие данные:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Email адрес</strong> — для авторизации и связи с пользователем</li>
                <li><strong>Имя пользователя</strong> — для отображения в интерфейсе (по желанию)</li>
                <li><strong>Пароль</strong> — хранится в зашифрованном виде (bcrypt)</li>
                <li><strong>История генераций</strong> — сохраненные описания товаров</li>
                <li><strong>Технические данные</strong> — IP-адрес, тип браузера, cookies</li>
              </ul>
              <p>2.2. Мы не собираем данные банковских карт. Оплата обрабатывается через ЮKassa.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Зачем мы используем данные</h2>
            <div className="space-y-2 text-slate-700">
              <p>3.1. Персональные данные используются для:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Предоставления доступа к Сервису</li>
                <li>Идентификации пользователя при авторизации</li>
                <li>Подсчета количества использованных генераций</li>
                <li>Управления подпиской PRO</li>
                <li>Связи с пользователем по вопросам поддержки</li>
                <li>Улучшения качества Сервиса</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Cookies и технологии отслеживания</h2>
            <div className="space-y-2 text-slate-700">
              <p>4.1. Мы используем cookies для:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Сохранения сессии авторизации</li>
                <li>Подсчета бесплатных генераций</li>
                <li>Улучшения работы Сервиса</li>
              </ul>
              <p>4.2. Вы можете отключить cookies в настройках браузера, но это может ограничить функциональность Сервиса.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Передача данных третьим лицам</h2>
            <div className="space-y-2 text-slate-700">
              <p>5.1. Мы не передаем ваши персональные данные третьим лицам, за исключением:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>ЮKassa</strong> — для обработки платежей (передается только минимально необходимая информация)</li>
                <li><strong>Supabase</strong> — для хранения данных пользователей (защищенная база данных)</li>
                <li><strong>Railway</strong> — хостинг-провайдер (технические данные)</li>
              </ul>
              <p>5.2. Мы не продаем и не передаем ваши данные рекламодателям или спамерам.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Защита данных</h2>
            <div className="space-y-2 text-slate-700">
              <p>6.1. Мы применяем технические и организационные меры для защиты данных:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Шифрование соединения (HTTPS)</li>
                <li>Защищенное хранение в базе данных</li>
                <li>Ограниченный доступ к данным</li>
                <li>Регулярное обновление систем безопасности</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Ваши права</h2>
            <div className="space-y-2 text-slate-700">
              <p>7.1. В соответствии с ФЗ-152 «О персональных данных» вы имеете право:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Получить информацию о ваших персональных данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
              <p>7.2. Для реализации своих прав обратитесь на: <a href="mailto:descrosupport@gmail.com" className="text-blue-600 hover:underline">descrosupport@gmail.com</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">8. Срок хранения данных</h2>
            <div className="space-y-2 text-slate-700">
              <p>8.1. Персональные данные хранятся в течение:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Срока действия подписки PRO</li>
                <li>3 лет после последнего использования Сервиса</li>
                <li>Срока, необходимого для выполнения обязательств по договору</li>
              </ul>
              <p>8.2. После истечения срока данные удаляются или обезличиваются.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">9. Изменения в Политике</h2>
            <div className="space-y-2 text-slate-700">
              <p>9.1. Мы можем обновлять Политику конфиденциальности. Новая редакция публикуется на этой странице.</p>
              <p>9.2. Продолжение использования Сервиса после изменений означает согласие с новой редакцией.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">10. Контакты</h2>
            <div className="space-y-2 text-slate-700">
              <p>По вопросам обработки персональных данных обращайтесь:</p>
              <p><strong>Email:</strong> <a href="mailto:descrosupport@gmail.com" className="text-blue-600 hover:underline">descrosupport@gmail.com</a></p>
            </div>
          </section>

          <div className="text-center text-sm text-slate-500 pt-6 border-t border-slate-200">
            <p>Дата последнего обновления: 24 апреля 2026 г.</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
