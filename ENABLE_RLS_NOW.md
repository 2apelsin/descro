# 🔴 КРИТИЧНО: Включить Row Level Security (RLS)

## Проблема
Supabase обнаружил критическую уязвимость безопасности:
- Таблица `payments` общедоступна без RLS
- Любой может читать данные о платежах других пользователей
- Нужно срочно включить защиту

## Решение за 2 минуты

### Шаг 1: Открыть Supabase SQL Editor
Перейти по ссылке:
```
https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql
```

### Шаг 2: Скопировать SQL
Открыть файл `supabase-rls-policies.sql` в этом проекте и скопировать весь код.

### Шаг 3: Выполнить SQL
1. Вставить код в SQL Editor
2. Нажать "Run" или Ctrl+Enter
3. Дождаться сообщения "Success"

### Шаг 4: Проверить результат
Выполнить проверочный запрос:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'payments', 'generations');
```

Должно показать:
```
tablename    | rowsecurity
-------------|------------
users        | true
payments     | true
generations  | true
```

## Что делает этот SQL?

### Для таблицы `users`:
- ✅ Пользователи видят только свой профиль
- ✅ Пользователи могут обновлять только свой профиль
- ✅ API (service_role) может управлять всеми пользователями

### Для таблицы `payments`:
- ✅ Пользователи видят только свои платежи
- ✅ API (service_role) может управлять всеми платежами (для webhook)
- ✅ Пользователи НЕ могут создавать платежи напрямую

### Для таблицы `generations`:
- ✅ Пользователи видят только свои генерации
- ✅ Пользователи могут удалять только свои генерации
- ✅ API (service_role) может управлять всеми генерациями

## После выполнения

### Тест 1: Проверить webhook
1. Создать тестовый платеж на 1₽
2. Оплатить через YooKassa
3. Проверить что PRO активировался

### Тест 2: Проверить генерации
1. Создать новую генерацию
2. Открыть Dashboard
3. Проверить что история загружается
4. Попробовать удалить генерацию

### Тест 3: Проверить профиль
1. Открыть Dashboard
2. Проверить что данные пользователя загружаются
3. Проверить счетчик генераций

## Важно!

После включения RLS все запросы к базе данных должны:
1. Использовать `SUPABASE_SERVICE_ROLE_KEY` (не anon key)
2. Передавать JWT токен пользователя (где нужно)

Все API endpoints уже настроены правильно, ничего менять не нужно!

## Если что-то сломалось

### Откатить изменения:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE generations DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage all users" ON users;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can delete own generations" ON generations;
DROP POLICY IF EXISTS "Service role can manage all generations" ON generations;
```

## Статус
- ⏳ SQL файл готов: `supabase-rls-policies.sql`
- ⏳ Нужно выполнить в Supabase SQL Editor
- ⏳ После выполнения протестировать все функции
