# 🚀 Инструкция по настройке системы авторизации и подписки

## 📋 Что было создано

Полная система входа и подписки с:
- ✅ Модальное окно входа (Telegram + Email Magic Link)
- ✅ Счётчик бесплатных попыток (3 для гостей, 3 для авторизованных)
- ✅ Интеграция с Supabase Auth
- ✅ Оплата через ЮKassa
- ✅ PRO подписка (безлимит)
- ✅ Страницы успеха/отмены оплаты

## 🔧 Шаг 1: Настройка Supabase

### 1.1 Выполните миграцию базы данных

Откройте Supabase Dashboard → SQL Editor и выполните файл `supabase-migration.sql`:

```sql
-- Скопируйте и выполните весь код из supabase-migration.sql
```

Это создаст:
- Таблицу `profiles` с полями для PRO подписки
- Триггер для автоматического создания профиля
- RLS политики
- Таблицу `user_generations` для истории

### 1.2 Получите ключи Supabase

В Supabase Dashboard → Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL` - уже есть в .env.local
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - **ДОБАВЬТЕ** в .env.local
- `SUPABASE_SERVICE_ROLE_KEY` - уже есть

## 🤖 Шаг 2: Настройка Telegram бота

### 2.1 Получите имя бота

1. Откройте @BotFather в Telegram
2. Найдите вашего бота (токен уже есть в .env.local)
3. Скопируйте username бота (БЕЗ @)

### 2.2 Обновите .env.local

```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот_без_собаки
```

Например, если бот `@descro_bot`, то:
```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=descro_bot
```

### 2.3 Настройте домен для Telegram Login

В @BotFather:
```
/setdomain
Выберите вашего бота
Введите: descro-production.up.railway.app
```

## 💳 Шаг 3: Настройка ЮKassa

### 3.1 Регистрация в ЮKassa

1. Зарегистрируйтесь на https://yookassa.ru
2. Пройдите верификацию (нужны документы ИП/ООО)
3. Получите доступ к API

### 3.2 Получите ключи

В личном кабинете ЮKassa → Настройки → API:
- `YOOKASSA_SHOP_ID` - ID магазина
- `YOOKASSA_SECRET_KEY` - Секретный ключ

Обновите .env.local:
```bash
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
```

### 3.3 Настройте webhook

В ЮKassa → Настройки → Уведомления:
- URL: `https://descro-production.up.railway.app/api/payment/webhook`
- Метод: POST
- События: `payment.succeeded`

## 🌐 Шаг 4: Обновите переменные окружения

Полный список переменных в `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_key_из_supabase
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key

# Telegram
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот_без_собаки

# JWT
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars

# ЮKassa
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
NEXT_PUBLIC_SITE_URL=https://descro-production.up.railway.app

# GigaChat (уже настроено)
GIGACHAT_CLIENT_ID=...
GIGACHAT_CLIENT_SECRET=...
```

## 🚀 Шаг 5: Деплой

### 5.1 Установите зависимости (если нужно)

```bash
npm install jose @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### 5.2 Обновите Railway

```bash
git add .
git commit -m "Add auth and payment system"
git push
```

### 5.3 Добавьте переменные в Railway

В Railway Dashboard → Variables добавьте все переменные из .env.local

## ✅ Шаг 6: Тестирование

### 6.1 Проверьте счётчик гостей

1. Откройте сайт в режиме инкогнито
2. Сделайте 3 генерации
3. Должна появиться блокировка с кнопкой "Войти"

### 6.2 Проверьте вход через Telegram

1. Нажмите "Войти"
2. Кликните на кнопку Telegram Login
3. Авторизуйтесь
4. Должно перезагрузить страницу с авторизацией

### 6.3 Проверьте вход через Email

1. Нажмите "Войти"
2. Введите email
3. Проверьте почту (и спам)
4. Кликните на ссылку

### 6.4 Проверьте оплату

1. Авторизуйтесь
2. Используйте 3 попытки
3. Нажмите "Оформить PRO"
4. Проверьте редирект на ЮKassa
5. Используйте тестовую карту: `5555 5555 5555 4477`

## 📁 Созданные файлы

```
components/
  ├── auth-modal.tsx              # Модалка входа
  └── generation-limiter.tsx      # Обёртка с лимитами

app/
  ├── api/
  │   ├── auth/
  │   │   └── telegram/route.ts   # Telegram авторизация
  │   └── payment/
  │       ├── create/route.ts     # Создание платежа
  │       └── webhook/route.ts    # Webhook от ЮKassa
  ├── payment/
  │   ├── success/page.tsx        # Страница успеха
  │   └── cancel/page.tsx         # Страница отмены
  └── pricing/page.tsx            # Страница с ценами

supabase-migration.sql            # SQL миграция
```

## 🎯 Как это работает

### Для гостей:
1. 3 бесплатные попытки (localStorage)
2. После 3-й → блокировка + модалка входа
3. Лимит сбрасывается через 24 часа

### Для авторизованных:
1. 3 бесплатные попытки (Supabase)
2. После 3-й → блокировка + кнопка "Купить PRO"
3. Лимит сбрасывается через 24 часа

### Для PRO:
1. Безлимитные генерации
2. Бейдж "PRO активен до [дата]"
3. Автоматическое продление через 30 дней

## 🐛 Troubleshooting

### Telegram Login не работает
- Проверьте `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` (без @)
- Убедитесь, что домен настроен в @BotFather
- Проверьте консоль браузера на ошибки

### Оплата не проходит
- Проверьте ключи ЮKassa
- Убедитесь, что webhook настроен
- Проверьте логи в Railway

### Профиль не создаётся
- Проверьте, что миграция выполнена
- Убедитесь, что триггер создан
- Проверьте RLS политики

## 📞 Поддержка

Если что-то не работает:
1. Проверьте логи в Railway
2. Проверьте консоль браузера
3. Проверьте Supabase Dashboard → Logs
4. Проверьте ЮKassa → История операций

---

**Готово!** Теперь у вас полноценная система авторизации и подписки 🎉
