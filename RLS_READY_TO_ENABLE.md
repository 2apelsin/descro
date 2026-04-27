# ✅ Готово к включению Row Level Security (RLS)

## Что было сделано

### 1. Обновлен SQL файл с политиками RLS
- ✅ Файл: `supabase-rls-policies.sql`
- ✅ Убраны ссылки на telegram_id (больше не используется)
- ✅ Добавлены политики для всех 3 таблиц: users, payments, generations
- ✅ Политики используют JWT токены для идентификации пользователей
- ✅ Service role может управлять всеми данными (для API)

### 2. Исправлен API endpoint /api/generate
- ✅ Заменен `supabase` (anon key) на `supabaseAdmin` (service_role key)
- ✅ Теперь будет работать после включения RLS
- ✅ Все операции с БД используют service_role

### 3. Проверены все API endpoints
Все endpoints уже используют `SUPABASE_SERVICE_ROLE_KEY`:
- ✅ /api/auth/register
- ✅ /api/auth/login
- ✅ /api/auth/me
- ✅ /api/auth/reset-password
- ✅ /api/auth/check-payments
- ✅ /api/payment/create
- ✅ /api/payment/webhook
- ✅ /api/generate (исправлено)
- ✅ /api/generations
- ✅ /api/generations/[id]
- ✅ /api/refund/request
- ✅ /api/admin/cancel-subscription

## Что делают политики RLS

### Таблица `users`
```sql
-- Пользователи видят только свой профиль
-- Пользователи могут обновлять только свой профиль
-- API (service_role) управляет всеми пользователями
```

### Таблица `payments`
```sql
-- Пользователи видят только свои платежи
-- API (service_role) управляет всеми платежами
-- Webhook YooKassa работает через service_role
```

### Таблица `generations`
```sql
-- Пользователи видят только свои генерации
-- Пользователи могут удалять только свои генерации
-- API (service_role) управляет всеми генерациями
```

## Как включить RLS (2 минуты)

### Шаг 1: Открыть Supabase SQL Editor
```
https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql
```

### Шаг 2: Выполнить SQL
1. Открыть файл `supabase-rls-policies.sql`
2. Скопировать весь код
3. Вставить в SQL Editor
4. Нажать "Run" (или Ctrl+Enter)
5. Дождаться "Success"

### Шаг 3: Проверить что RLS включен
Выполнить в SQL Editor:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'payments', 'generations');
```

Должно показать `rowsecurity = true` для всех 3 таблиц.

## После включения - обязательное тестирование

### Тест 1: Регистрация и вход
1. Открыть сайт в режиме инкогнито
2. Зарегистрировать нового пользователя
3. Войти в аккаунт
4. Проверить что Dashboard открывается

### Тест 2: Генерация описаний
1. Создать новую генерацию
2. Проверить что описание создалось
3. Открыть Dashboard
4. Проверить что генерация появилась в истории

### Тест 3: История генераций
1. Открыть Dashboard
2. Проверить что загружается история
3. Попробовать скопировать генерацию
4. Попробовать удалить генерацию

### Тест 4: Платежная система
1. Создать тестовый платеж на 1₽
2. Оплатить через YooKassa
3. Проверить что PRO активировался
4. Проверить что платеж появился в БД

### Тест 5: Webhook YooKassa
1. Создать платеж
2. Оплатить
3. Проверить логи Railway: https://railway.app/project/[your-project]/deployments
4. Убедиться что webhook обработался без ошибок

## Если что-то сломалось

### Откатить RLS (выполнить в SQL Editor):
```sql
-- Отключить RLS
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE generations DISABLE ROW LEVEL SECURITY;

-- Удалить политики
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
DROP POLICY IF EXISTS "Service role can manage all generations" ON generations;
```

### Проверить логи ошибок:
1. Railway: https://railway.app/project/[your-project]/deployments
2. Supabase: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/logs/explorer
3. Browser Console (F12)

## Почему это важно

### Без RLS (сейчас):
- ❌ Любой может читать данные о платежах других пользователей
- ❌ Любой может видеть email и пароли других пользователей
- ❌ Любой может читать генерации других пользователей
- ❌ Критическая уязвимость безопасности

### С RLS (после включения):
- ✅ Пользователи видят только свои данные
- ✅ API работает через service_role (полный доступ)
- ✅ Webhook YooKassa работает нормально
- ✅ Безопасность на уровне базы данных

## Следующие шаги после включения RLS

1. ✅ Включить RLS в Supabase
2. ✅ Протестировать все функции
3. ✅ Проверить логи на ошибки
4. 🔄 Задеплоить обновленный код на Railway
5. 🔄 Протестировать на production
6. 🔄 Убрать NODE_TLS_REJECT_UNAUTHORIZED из Railway env vars

## Статус

- ✅ SQL файл готов и обновлен
- ✅ Все API endpoints используют service_role
- ✅ Endpoint /api/generate исправлен
- ✅ Создана инструкция ENABLE_RLS_NOW.md
- ⏳ Нужно выполнить SQL в Supabase
- ⏳ Нужно протестировать после включения
- ⏳ Нужно задеплоить на Railway

## Полезные ссылки

- Supabase SQL Editor: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql
- Supabase Logs: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/logs/explorer
- Railway Deployments: https://railway.app
- Документация RLS: https://supabase.com/docs/guides/auth/row-level-security
