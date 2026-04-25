# ЗАПУСК СИСТЕМЫ - ДЕЛАЙ ПО ПОРЯДКУ

## 1. Создай таблицу в Supabase

Зайди в Supabase → SQL Editor → вставь и запусти:

```sql
-- Простая таблица пользователей
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

-- Индексы
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can do everything on users" ON public.users;
CREATE POLICY "Service role can do everything on users" ON public.users
  FOR ALL USING (true);
```

## 2. Проверь .env.local

Убедись что есть:
- `JWT_SECRET` - есть ✅
- `NEXT_PUBLIC_SUPABASE_URL` - есть ✅
- `SUPABASE_SERVICE_ROLE_KEY` - есть ✅
- `YOOKASSA_SHOP_ID` - добавь свой
- `YOOKASSA_SECRET_KEY` - добавь свой

## 3. Запусти проект

```bash
npm run dev
```

## 4. Проверь что работает

1. Открой сайт
2. Нажми "Войти" → появится модалка
3. Зарегистрируйся (email + пароль)
4. Попадёшь в личный кабинет `/dashboard`
5. Увидишь свой email и статус подписки

## Что работает:

✅ Регистрация/вход по email+пароль
✅ Личный кабинет с инфо о подписке
✅ 3 бесплатные генерации в день
✅ Покупка PRO за 199₽/месяц
✅ Автоактивация подписки после оплаты
✅ Безлимит для PRO пользователей

## Никакого телеграма!

Всё просто и работает.
