# Descro — AI-генератор описаний для маркетплейсов

Полнофункциональный лендинг с рабочей генерацией, авторизацией и платежами.

## 🚀 Быстрый старт

### Локально
```bash
npm install
npm run dev
```

Откройте http://localhost:3000

### Что работает из коробки

✅ **Авторизация** - простая регистрация по email + пароль
✅ **Личный кабинет** - `/dashboard` с инфо о подписке
✅ **Лимиты** - 3 бесплатные генерации в день
✅ **PRO подписка** - 199₽/мес, безлимитные генерации
✅ **Автоплатежи** - интеграция с ЮKassa
✅ **AI генерация** - через GigaChat API

## 📋 Настройка (5 минут)

### 1. Установи пакеты
```bash
npm install
```

### 2. Создай таблицу в Supabase

Зайди в SQL Editor и запусти:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  generations_left INTEGER DEFAULT 3,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pro_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can do everything on users" ON public.users;
CREATE POLICY "Service role can do everything on users" ON public.users FOR ALL USING (true);
```

### 3. Проверь .env.local

Должны быть:
- `JWT_SECRET` ✅
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `GIGACHAT_CLIENT_ID` ✅
- `GIGACHAT_CLIENT_SECRET` ✅
- `YOOKASSA_SHOP_ID` (добавь свой)
- `YOOKASSA_SECRET_KEY` (добавь свой)

### 4. Запусти
```bash
npm run dev
```

## 🎯 Как работает

1. Пользователь регистрируется (email + пароль)
2. Получает 3 бесплатные генерации в день
3. Может купить PRO за 199₽/мес
4. После оплаты подписка активируется автоматически
5. PRO = безлимитные генерации

## ✨ Все фичи реализованы

### 🔐 Авторизация
- ✅ Регистрация/вход по email + пароль
- ✅ JWT токены (хранятся в localStorage)
- ✅ Автоматический сброс лимитов каждые 24 часа
- ✅ Защита API endpoints

### 👤 Личный кабинет
- ✅ Показывает email и имя
- ✅ Статус подписки (Free/PRO)
- ✅ Сколько генераций осталось
- ✅ До какой даты активен PRO
- ✅ Кнопка покупки подписки

### 💳 Платежи
- ✅ Интеграция с ЮKassa
- ✅ Автоматическая активация PRO на 30 дней
- ✅ Webhook для обработки платежей
- ✅ Цена: 199₽/месяц

### 🎨 UX и конверсия
- ✅ **Рабочее демо** без регистрации
- ✅ **Placeholder текст** в полях
- ✅ **Скелетная загрузка** с анимацией
- ✅ **Эффект печатной машинки**
- ✅ **Копирование одним кликом**
- ✅ **Лимит 3/день** с блокировкой

## 📁 Структура API

```
├── app/api/
│   ├── auth/
│   │   ├── register/route.ts    # Регистрация
│   │   ├── login/route.ts       # Вход
│   │   └── me/route.ts          # Получить профиль
│   ├── payment/
│   │   ├── create/route.ts      # Создать платёж
│   │   └── webhook/route.ts     # Webhook от ЮKassa
│   └── generate/route.ts        # Генерация описаний
```

## 🗄️ База данных

Таблица `users`:
- `id` - UUID пользователя
- `email` - email (уникальный)
- `password_hash` - хеш пароля (bcrypt)
- `name` - имя пользователя
- `generations_left` - сколько осталось генераций (3 в день)
- `pro_until` - до какой даты активен PRO
- `last_reset` - когда последний раз сбрасывались лимиты
- `created_at` - дата регистрации

## 🚀 Деплой

### Railway (рекомендуется)

1. Зайди на https://railway.app
2. Подключи GitHub репозиторий
3. Добавь переменные окружения из `.env.local`
4. Готово!

**Важно:** Не используй Vercel — он не поддерживает `NODE_TLS_REJECT_UNAUTHORIZED=0` для GigaChat API.

Подробная инструкция: `RAILWAY_DEPLOY.md`

## 📚 Документация

- `READY_TO_USE.md` — быстрый старт ⭐
- `SIMPLE_ACCOUNT_SYSTEM.md` — как работает авторизация
- `RAILWAY_DEPLOY.md` — деплой на Railway
- `GIGACHAT_SETUP.md` — настройка GigaChat API
- `YOOKASSA_SETUP.md` — настройка платежей

## 🔧 Технологии

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Auth:** JWT + bcrypt
- **Database:** Supabase (PostgreSQL)
- **Payments:** ЮKassa
- **AI:** GigaChat API (Сбер)

## 📄 Лицензия

MIT
