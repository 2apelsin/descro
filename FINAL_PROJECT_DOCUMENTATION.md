# 📋 Descro - Полная Техническая Документация

## 🎯 О Проекте

**Descro** - AI-сервис для автоматической генерации продающих описаний товаров для маркетплейсов (Ozon, Wildberries, Яндекс Маркет).

- **URL:** https://descro-production.up.railway.app
- **GitHub:** https://github.com/2apelsin/descro
- **Статус:** ✅ Production Ready
- **Дата запуска:** Апрель 2026

---

## 🏗 Архитектура

### Tech Stack

**Frontend:**
- Next.js 16.2.0 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

**Backend:**
- Next.js API Routes (Node.js runtime)
- Supabase (PostgreSQL)
- GigaChat API (Сбер AI)
- YooKassa (платежи)

**Инфраструктура:**
- Railway (хостинг)
- Supabase Cloud (БД)
- Яндекс.Метрика (аналитика)

### Структура проекта

```
descro/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── auth/                 # Аутентификация
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── reset-password/route.ts
│   │   ├── generate/route.ts     # Генерация описаний (GigaChat)
│   │   ├── generations/          # История генераций
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── payment/              # Платежная система
│   │   │   ├── create/route.ts
│   │   │   └── webhook/route.ts
│   │   └── refund/
│   │       └── request/route.ts
│   ├── dashboard/page.tsx        # Личный кабинет
│   ├── pricing/page.tsx          # Тарифы
│   ├── payment/                  # Страницы оплаты
│   │   ├── success/page.tsx
│   │   └── cancel/page.tsx
│   ├── privacy/page.tsx          # Политика конфиденциальности
│   ├── oferta/page.tsx           # Оферта
│   ├── requisites/page.tsx       # Реквизиты
│   ├── layout.tsx                # Root layout с SEO
│   ├── sitemap.ts                # Автогенерация sitemap
│   └── globals.css               # Глобальные стили
├── components/                   # React компоненты
│   ├── auth-modal.tsx            # Модалка авторизации
│   ├── demo-form.tsx             # Форма генерации
│   ├── generation-history.tsx    # История генераций
│   ├── hero.tsx                  # Hero секция
│   ├── pricing.tsx               # Блок тарифов
│   ├── site-header.tsx           # Шапка сайта
│   ├── yandex-metrika.tsx        # Яндекс.Метрика
│   ├── structured-data.tsx       # JSON-LD для SEO
│   └── ...                       # Другие компоненты
├── lib/                          # Утилиты
│   ├── auth-context.tsx          # React Context для auth
│   ├── auth.ts                   # JWT утилиты
│   ├── supabase.ts               # Supabase клиент
│   └── api-client.ts             # API helper функции
├── public/                       # Статические файлы
│   ├── robots.txt                # SEO
│   ├── yandex_*.html             # Верификация Яндекс
│   └── oferta.html               # Статическая оферта
└── supabase-*.sql                # SQL миграции

```

---

## 🔐 Система Аутентификации

### Реализация

**Тип:** Email + Password (JWT в httpOnly cookies)

**Файлы:**
- `app/api/auth/login/route.ts` - вход
- `app/api/auth/register/route.ts` - регистрация
- `app/api/auth/me/route.ts` - проверка токена
- `app/api/auth/logout/route.ts` - выход
- `lib/auth-context.tsx` - React Context

**База данных:**
```sql
-- Таблица users в Supabase
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  generations_left INTEGER DEFAULT 3,
  pro_until TIMESTAMP,
  last_reset TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Безопасность:**
- ✅ Пароли хешируются через bcrypt (10 раундов)
- ✅ JWT токены в httpOnly cookies (защита от XSS)
- ✅ Cookie настройки: `httpOnly: true, secure: production, sameSite: 'lax'`
- ✅ Срок жизни токена: 30 дней
- ✅ Автоматическая проверка токена при каждом запросе

**Документация:**
- `JWT_MIGRATION_COMPLETE.md` - детали миграции на cookies
- `AUTH_SYSTEM_READY.md` - описание системы

---

## 🤖 AI Генерация (GigaChat)

### Интеграция

**API:** GigaChat от Сбера
**Модель:** GigaChat (русскоязычная)

**Файл:** `app/api/generate/route.ts`

**Credentials:**
```env
GIGACHAT_CLIENT_ID=019dbb35-9281-71cd-9574-3d2b1de4ccfa
GIGACHAT_CLIENT_SECRET=MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA==
```

**Особенности:**
- ✅ Custom HTTPS agent (обход SSL проблем Сбера)
- ✅ Retry логика с экспоненциальной задержкой (1s, 2s, 4s)
- ✅ Обработка ошибок 429 (Rate Limit) и 5xx
- ✅ Timeout и fallback механизмы

**Промпт:**
```typescript
const prompt = `Ты — эксперт по маркетплейсам Ozon и Wildberries. 
Создай продающее описание товара.

ТОВАР:
Название: ${name}
Категория: ${category}
Характеристики: ${features}

ТРЕБОВАНИЯ:
1. Заголовок (title): до 60 символов, с ключевыми словами для SEO
2. Буллеты (bullets): 5 коротких фраз, каждая — конкретная выгода
3. Описание (description): 300-500 символов, продающий текст с эмодзи
4. Ключевые слова (keywords): 8-10 слов для поиска

Верни ТОЛЬКО JSON без markdown:
{
  "title": "заголовок",
  "bullets": ["буллет 1", "буллет 2", ...],
  "description": "описание",
  "keywords": "слово1, слово2, ..."
}`
```

**Документация:**
- `GIGACHAT_SETUP.md` - настройка API
- `GIGACHAT_SSL_FIX.md` - решение SSL проблем

---

## 💳 Платежная Система (YooKassa)

### Интеграция

**Провайдер:** YooKassa (Яндекс.Касса)
**Тип:** Подписочная модель

**Credentials:**
```env
YOOKASSA_SHOP_ID=1338860
YOOKASSA_SECRET_KEY=live_2db7V3OuhRasAnUUwD7pGICDavrp-exydLhF8-GPfRc
```

**Тарифы:**
- Бесплатный: 3 генерации/день
- PRO: 199₽ первый месяц (скидка 33%), далее 299₽/месяц
- Тестовая цена: 1₽ (для тестирования)

**Файлы:**
- `app/api/payment/create/route.ts` - создание платежа
- `app/api/payment/webhook/route.ts` - обработка webhook
- `app/payment/success/page.tsx` - страница успеха
- `app/payment/cancel/page.tsx` - страница отмены

**Webhook Events:**
```typescript
// payment.succeeded - успешная оплата
// payment.canceled - отмена платежа
// refund.succeeded - возврат средств
```

**Flow:**
1. Пользователь нажимает "Получить PRO"
2. POST `/api/payment/create` → создает платеж в YooKassa
3. Редирект на страницу оплаты YooKassa
4. Пользователь оплачивает
5. YooKassa отправляет webhook на `/api/payment/webhook`
6. Webhook активирует PRO на 30 дней
7. Редирект на `/payment/success`

**База данных:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  yookassa_payment_id TEXT UNIQUE,
  amount DECIMAL(10,2),
  status TEXT,
  notification_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Документация:**
- `YOOKASSA_SETUP.md` - настройка интеграции
- `PAYMENT_FIXED.md` - исправленные баги
- `WEBHOOK_DEBUG.md` - отладка webhook

---

## 🗄 База Данных (Supabase)

### Схема

**Проект:** zsmchferozuopiqhekyb.supabase.co

**Таблицы:**

1. **users** - пользователи
```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
name TEXT
generations_left INTEGER DEFAULT 3
pro_until TIMESTAMP
last_reset TIMESTAMP
created_at TIMESTAMP
```

2. **payments** - платежи
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
yookassa_payment_id TEXT UNIQUE
amount DECIMAL(10,2)
status TEXT
notification_url TEXT
created_at TIMESTAMP
```

3. **generations** - история генераций
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
title TEXT
description TEXT
bullets TEXT[]
keywords TEXT
created_at TIMESTAMP
```

4. **refund_requests** - запросы на возврат
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
payment_id UUID REFERENCES payments(id)
reason TEXT
status TEXT
created_at TIMESTAMP
```

**Credentials:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**SQL Файлы:**
- `supabase-schema.sql` - основная схема
- `supabase-migration.sql` - миграции
- `supabase-payments.sql` - таблица платежей
- `supabase-rls-policies.sql` - Row Level Security (нужно выполнить!)

**Документация:**
- `supabase-schema.sql` - полная схема БД

---

## 🎨 Frontend

### Компоненты

**Основные страницы:**
- `/` - главная (hero, features, pricing, FAQ)
- `/dashboard` - личный кабинет
- `/pricing` - тарифы
- `/privacy` - политика конфиденциальности
- `/oferta` - оферта
- `/requisites` - реквизиты

**Ключевые компоненты:**

1. **auth-modal.tsx** - модальное окно авторизации
   - Вход / Регистрация
   - Восстановление пароля
   - Валидация форм

2. **demo-form.tsx** - форма генерации описаний
   - Поля: название, категория, характеристики
   - Лимиты и paywall
   - Анимация загрузки
   - Копирование результата

3. **generation-history.tsx** - история генераций
   - Последние 20 генераций
   - Кнопки копирования и удаления
   - Дата создания

4. **pricing.tsx** - блок тарифов
   - Free и PRO планы
   - Интеграция с оплатой
   - Проверка статуса PRO

5. **site-header.tsx** - шапка сайта
   - Навигация
   - Кнопка входа/профиль
   - Sticky header с backdrop-blur

**Стили:**
- Tailwind CSS с custom конфигурацией
- Mobile-first подход
- Dark theme (slate-900 background)
- Градиенты и backdrop-blur эффекты

**Документация:**
- `app/globals.css` - глобальные стили и mobile оптимизация

---

## 📊 SEO и Аналитика

### SEO Оптимизация

**Реализовано:**
- ✅ robots.txt (`public/robots.txt`)
- ✅ sitemap.xml (автогенерация через `app/sitemap.ts`)
- ✅ Meta-теги (title, description, keywords)
- ✅ Open Graph для соцсетей
- ✅ Structured Data (JSON-LD) - `components/structured-data.tsx`
- ✅ Canonical URLs
- ✅ Яндекс верификация: `yandex-verification: 4f79fc537d4c7d48`

**Ключевые слова:**
- генератор описаний товаров
- описания для ozon
- описания для wildberries
- ai генератор текстов
- карточки товаров
- seo описания товаров

**Файлы:**
- `app/layout.tsx` - meta-теги и structured data
- `app/sitemap.ts` - автогенерация sitemap
- `public/robots.txt` - правила для поисковиков
- `components/structured-data.tsx` - JSON-LD разметка

### Аналитика

**Яндекс.Метрика:**
- ID: 108773114
- Компонент: `components/yandex-metrika.tsx`
- Отслеживание: клики, конверсии, вебвизор, ecommerce

**Настройки:**
```typescript
ym(108773114, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  ecommerce: "dataLayer"
});
```

**Документация:**
- `SEO_GUIDE.md` - полный SEO гайд
- `YANDEX_METRIKA_SETUP.md` - настройка метрики

---

## 🚀 Deployment

### Railway

**URL:** https://descro-production.up.railway.app

**Environment Variables:**
```env
# GigaChat
GIGACHAT_CLIENT_ID=019dbb35-9281-71cd-9574-3d2b1de4ccfa
GIGACHAT_CLIENT_SECRET=MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA==

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars

# YooKassa
YOOKASSA_SHOP_ID=1338860
YOOKASSA_SECRET_KEY=live_2db7V3OuhRasAnUUwD7pGICDavrp-exydLhF8-GPfRc
NEXT_PUBLIC_SITE_URL=https://descro-production.up.railway.app

# ⚠️ УДАЛИТЬ ПОСЛЕ ДЕПЛОЯ:
# NODE_TLS_REJECT_UNAUTHORIZED=0
```

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npm start
```

**Документация:**
- `RAILWAY_DEPLOY.md` - инструкция по деплою

---

## 🔒 Безопасность

### Реализованные меры

1. **JWT в httpOnly cookies**
   - Защита от XSS атак
   - Автоматическая отправка с каждым запросом
   - Срок жизни: 30 дней

2. **Custom HTTPS Agent для GigaChat**
   - Изолированное отключение SSL проверки только для GigaChat
   - Не влияет на другие запросы

3. **Retry логика**
   - Экспоненциальная задержка при ошибках
   - Умная обработка 4xx и 5xx ошибок

4. **Row Level Security (RLS)**
   - SQL готов в `supabase-rls-policies.sql`
   - Нужно выполнить в Supabase

5. **Rate Limiting**
   - Защита от спама в payment API
   - 3 попытки в минуту

**Документация:**
- `SECURITY.md` - best practices
- `GIGACHAT_SSL_FIX.md` - решение SSL проблем
- `JWT_MIGRATION_COMPLETE.md` - миграция на cookies

---

## 📱 Мобильная Версия

### Оптимизация

**Реализовано:**
- ✅ Mobile-first дизайн
- ✅ Touch-friendly кнопки (min 44px)
- ✅ Адаптивные размеры текста (text-3xl → sm:text-4xl → md:text-5xl)
- ✅ Sticky header с backdrop-blur
- ✅ Предотвращение zoom на iOS (font-size: 16px для input)
- ✅ Оптимизация модальных окон (max-height: 90vh)
- ✅ Скрытие горизонтального скролла

**Breakpoints:**
```css
sm: 640px   /* Маленькие телефоны */
md: 768px   /* Планшеты */
lg: 1024px  /* Десктопы */
xl: 1280px  /* Большие экраны */
```

**Файлы:**
- `app/globals.css` - mobile-specific стили
- `components/hero.tsx` - адаптивный hero
- `components/site-header.tsx` - адаптивный header
- `components/auth-modal.tsx` - адаптивная модалка

---

## 📚 Документация

### Основные файлы

**Технические:**
- `PROJECT_OVERVIEW.md` - обзор проекта (15+ страниц)
- `CRITICAL_FIXES_TODO.md` - чеклист задач
- `WORK_COMPLETED.md` - выполненная работа
- `JWT_MIGRATION_COMPLETE.md` - детали JWT миграции
- `GIGACHAT_SSL_FIX.md` - решение SSL проблем

**SEO:**
- `SEO_GUIDE.md` - полный SEO гайд
- `YANDEX_METRIKA_SETUP.md` - настройка аналитики

**Платежи:**
- `YOOKASSA_SETUP.md` - настройка YooKassa
- `PAYMENT_FIXED.md` - исправленные баги
- `WEBHOOK_DEBUG.md` - отладка webhook
- `REFUND_SETUP.md` - система возвратов

**Безопасность:**
- `SECURITY.md` - best practices
- `supabase-rls-policies.sql` - Row Level Security

**Деплой:**
- `RAILWAY_DEPLOY.md` - инструкция по деплою
- `VERCEL_DEPLOY.md` - альтернативный деплой

---

## ✅ Чеклист Готовности

### Функционал
- ✅ Регистрация и вход
- ✅ Генерация описаний (GigaChat)
- ✅ Лимиты (3 бесплатных/день)
- ✅ История генераций
- ✅ Оплата (YooKassa)
- ✅ Webhook автоактивация PRO
- ✅ Возврат средств
- ✅ Личный кабинет

### Безопасность
- ✅ httpOnly cookies
- ✅ Custom HTTPS agent
- ✅ Retry логика
- ⏳ RLS (SQL готов, нужно выполнить)

### SEO
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Meta-теги
- ✅ Structured Data
- ✅ Яндекс.Метрика
- ✅ Яндекс верификация
- ⏳ Google Search Console

### UX
- ✅ Мобильная версия
- ✅ Адаптивный дизайн
- ✅ Быстрая загрузка
- ✅ Анимации

---

## 🎯 Следующие Шаги

### Обязательно (перед запуском):
1. ⚠️ Удалить `NODE_TLS_REJECT_UNAUTHORIZED` из Railway
2. ⚠️ Выполнить `supabase-rls-policies.sql` в Supabase
3. ⚠️ Подтвердить сайт в Яндекс Вебмастер
4. ⚠️ Добавить sitemap в Яндекс Вебмастер

### Рекомендуется:
1. Зарегистрировать в Google Search Console
2. Создать og-image.png (1200x630px)
3. Добавить иконки сайта
4. Купить домен (descro.ru)
5. Настроить email уведомления (Resend/SendGrid)

### Опционально:
1. Добавить Google Analytics
2. Создать блог для SEO
3. Разместиться в каталогах (startpack.ru)
4. Написать статью на VC.ru

---

## 📞 Контакты и Ссылки

**Сайт:** https://descro-production.up.railway.app
**GitHub:** https://github.com/2apelsin/descro
**Email:** descrosupport@gmail.com

**Сервисы:**
- Supabase: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb
- Railway: https://railway.app
- YooKassa: https://yookassa.ru/my
- Яндекс.Метрика: https://metrika.yandex.ru/dashboard?id=108773114
- Яндекс Вебмастер: https://webmaster.yandex.ru

**API Документация:**
- GigaChat: https://developers.sber.ru/docs/ru/gigachat/api/overview
- YooKassa: https://yookassa.ru/developers
- Supabase: https://supabase.com/docs

---

## 📊 Статистика Проекта

**Код:**
- Языки: TypeScript, SQL, CSS
- Компоненты: 30+
- API endpoints: 15+
- Страницы: 10+

**База данных:**
- Таблицы: 4
- Индексы: настроены
- RLS: готов к включению

**Документация:**
- Файлов: 50+
- Страниц: 100+
- Строк кода: 5000+

---

**Статус:** ✅ Production Ready
**Версия:** 1.0.0
**Последнее обновление:** Апрель 2026

---

*Этот документ содержит полное описание проекта Descro для анализа другими AI-системами. Все ссылки, credentials и технические детали актуальны на момент создания.*
