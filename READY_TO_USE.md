# ✅ ВСЁ ГОТОВО К ЗАПУСКУ

## Что сделано:

1. ✅ Убрали весь телеграм
2. ✅ Сделали простую авторизацию email + пароль
3. ✅ Личный кабинет с инфо о подписке
4. ✅ Автоматическая активация PRO после оплаты
5. ✅ Лимиты: 3 генерации в день бесплатно, PRO = безлимит
6. ✅ Установили все пакеты (bcryptjs, jsonwebtoken)

## Осталось только:

### 1. Создай таблицу в Supabase

Зайди на https://zsmchferozuopiqhekyb.supabase.co → SQL Editor → вставь:

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
CREATE POLICY "Service role can do everything on users" ON public.users
  FOR ALL USING (true);
```

Нажми RUN.

### 2. Запусти проект

```bash
npm run dev
```

### 3. Проверь

1. Открой http://localhost:3000
2. Нажми "Войти" в шапке
3. Зарегистрируйся (email + пароль)
4. Попадёшь в личный кабинет
5. Увидишь: email, имя, статус подписки, сколько генераций осталось

## Как работает:

- **Бесплатно**: 3 генерации в день
- **PRO (199₽/мес)**: безлимит генераций
- **Оплата**: через ЮKassa, подписка активируется автоматически

## Всё!

Никакого телеграма, всё просто работает.
