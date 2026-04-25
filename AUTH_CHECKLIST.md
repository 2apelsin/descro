# ✅ Чеклист настройки системы авторизации

## 📦 Что создано

- [x] Модальное окно входа (`components/auth-modal.tsx`)
- [x] Компонент лимитера (`components/generation-limiter.tsx`)
- [x] API Telegram авторизации (`app/api/auth/telegram/route.ts`)
- [x] API создания платежа (`app/api/payment/create/route.ts`)
- [x] API webhook ЮKassa (`app/api/payment/webhook/route.ts`)
- [x] Страница успеха оплаты (`app/payment/success/page.tsx`)
- [x] Страница отмены оплаты (`app/payment/cancel/page.tsx`)
- [x] Страница с ценами (`app/pricing/page.tsx`)
- [x] SQL миграция (`supabase-migration.sql`)
- [x] Хук useAuth (`hooks/use-auth.ts`)

## 🔧 Что нужно сделать

### 1. Supabase

- [ ] Открыть Supabase Dashboard
- [ ] SQL Editor → Выполнить `supabase-migration.sql`
- [ ] Settings → API → Скопировать `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Добавить в `.env.local`:
  ```bash
  NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_ключ
  ```

### 2. Telegram Bot

- [ ] Открыть @BotFather
- [ ] Найти username вашего бота (без @)
- [ ] Добавить в `.env.local`:
  ```bash
  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот
  ```
- [ ] В @BotFather выполнить:
  ```
  /setdomain
  Выбрать бота
  Ввести: descro-production.up.railway.app
  ```

### 3. ЮKassa

- [ ] Зарегистрироваться на https://yookassa.ru
- [ ] Пройти верификацию
- [ ] Получить Shop ID и Secret Key
- [ ] Добавить в `.env.local`:
  ```bash
  YOOKASSA_SHOP_ID=ваш_shop_id
  YOOKASSA_SECRET_KEY=ваш_secret_key
  ```
- [ ] Настроить webhook:
  - URL: `https://descro-production.up.railway.app/api/payment/webhook`
  - События: `payment.succeeded`

### 4. Переменные окружения

Проверьте, что в `.env.local` есть все переменные:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key

# Telegram
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот

# JWT
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars

# ЮKassa
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
NEXT_PUBLIC_SITE_URL=https://descro-production.up.railway.app
```

### 5. Деплой

- [ ] Установить зависимости (если нужно):
  ```bash
  npm install
  ```
- [ ] Закоммитить изменения:
  ```bash
  git add .
  git commit -m "Add auth and payment system"
  git push
  ```
- [ ] Добавить переменные в Railway Dashboard

### 6. Тестирование

- [ ] Открыть сайт в инкогнито
- [ ] Сделать 3 генерации
- [ ] Проверить блокировку
- [ ] Нажать "Войти"
- [ ] Войти через Telegram
- [ ] Проверить счётчик попыток
- [ ] Использовать 3 попытки
- [ ] Нажать "Оформить PRO"
- [ ] Проверить редирект на ЮKassa
- [ ] Оплатить тестовой картой: `5555 5555 5555 4477`
- [ ] Проверить активацию PRO

## 🎨 Дизайн системы

### Модалка входа
- Тёмный фон с blur
- Карточка 420px
- Telegram Login Widget (официальный)
- Разделитель "или"
- Email вход (Magic Link)
- Подвал с текстом

### Блокировка для гостей
- Overlay с blur
- Текст "Бесплатные попытки закончились"
- Кнопка "Войти в аккаунт"

### Блокировка для авторизованных
- Overlay с blur
- Текст "Оформите PRO"
- Кнопка "Оформить PRO — 299 ₽/мес" с glow

### Счётчик попыток
- Для гостей: "Осталось попыток: 3"
- Для авторизованных: "Осталось попыток: 3"
- Для PRO: "✨ PRO активен до [дата]"

## 📊 Логика работы

### Гости (неавторизованные)
1. localStorage: `descro_guest_generations` = 3
2. При генерации: -1
3. При 0: блокировка + модалка входа
4. Сброс: через 24 часа

### Авторизованные (без PRO)
1. Supabase: `profiles.generations_left` = 3
2. При генерации: -1
3. При 0: блокировка + кнопка PRO
4. Сброс: через 24 часа

### PRO пользователи
1. Supabase: `profiles.pro_until` > now()
2. Безлимитные генерации
3. Бейдж с датой окончания
4. Автопродление через 30 дней

## 🔍 Проверка работы

### Проверка Supabase
```sql
-- Проверить таблицу profiles
SELECT * FROM profiles;

-- Проверить триггер
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Проверить RLS
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Проверка Telegram
- Откройте https://ваш-сайт.com
- Нажмите "Войти"
- Должна появиться кнопка Telegram Login
- При клике должен открыться Telegram

### Проверка ЮKassa
- Создайте тестовый платёж
- Проверьте редирект
- Используйте тестовую карту
- Проверьте webhook в логах Railway

## 🐛 Troubleshooting

### Telegram Login не появляется
- Проверьте `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
- Проверьте консоль браузера
- Убедитесь, что домен настроен в @BotFather

### Профиль не создаётся
- Проверьте выполнение миграции
- Проверьте триггер в Supabase
- Проверьте логи в Supabase Dashboard

### Оплата не проходит
- Проверьте ключи ЮKassa
- Проверьте webhook URL
- Проверьте логи в Railway
- Проверьте историю в ЮKassa

### PRO не активируется
- Проверьте webhook
- Проверьте логи `/api/payment/webhook`
- Проверьте таблицу profiles в Supabase

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи в Railway
2. Проверьте консоль браузера (F12)
3. Проверьте Supabase Dashboard → Logs
4. Проверьте ЮKassa → История операций

## 🎉 Готово!

После выполнения всех пунктов у вас будет:
- ✅ Вход через Telegram и Email
- ✅ Счётчик бесплатных попыток
- ✅ Блокировка после лимита
- ✅ Оплата через ЮKassa
- ✅ PRO подписка с безлимитом
- ✅ Автоматическое продление

---

**Следующий шаг:** Откройте `SETUP_AUTH_SYSTEM.md` для подробных инструкций
