# Простая система аккаунтов БЕЗ ТЕЛЕГРАМА ✅

## Что сделано:

### 1. Обычная авторизация Email + Пароль
- Регистрация: `/api/auth/register`
- Вход: `/api/auth/login`
- Проверка: `/api/auth/me`
- Модалка входа/регистрации в `components/auth-modal.tsx`

### 2. Личный кабинет (`/dashboard`)
- Показывает имя и email
- Показывает статус подписки (PRO или бесплатный)
- Для PRO: до какой даты активна и сколько дней осталось
- Для бесплатных: сколько генераций осталось сегодня (из 3)
- Кнопка "Купить подписку"

### 3. Автоматическая активация подписки
- Пользователь платит → webhook → PRO активируется на 30 дней
- Безлимитные генерации сразу после оплаты

### 4. Проверка лимитов
- PRO: безлимит
- Бесплатные: 3 генерации в день
- Автосброс каждые 24 часа

## Установка:

1. Установи пакеты:
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

2. Добавь в `.env.local`:
```
JWT_SECRET=твой-секретный-ключ-измени-это
```

3. Создай таблицу в Supabase (запусти SQL из `supabase-simple-auth.sql`):
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  generations_left INTEGER DEFAULT 3,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pro_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Как работает:

1. Пользователь регистрируется (email + пароль)
2. Получает токен, сохраняется в localStorage
3. Видит свой аккаунт в `/dashboard`
4. Покупает PRO за 199₽/месяц
5. Подписка активируется автоматически
6. Получает безлимит на 30 дней

## Цена: 199₽/месяц

Никакого телеграма, всё просто!

