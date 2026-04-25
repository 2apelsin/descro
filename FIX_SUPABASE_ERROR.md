# 🔧 Исправление ошибки Supabase

## Проблема

Ошибка: `Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point`

Это происходит потому что:
1. В HTTP заголовках была кириллица (из сообщений об ошибках)
2. Возможно неправильный `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ Что исправлено

1. Убрал кириллицу из сообщений об ошибках в `app/login/page.tsx`
2. Добавил логирование ошибок в консоль

## 🔑 Проверьте Supabase ключи

### 1. Получите правильный ANON KEY

1. Откройте Supabase Dashboard: https://supabase.com/dashboard
2. Выберите ваш проект
3. Settings → API
4. Скопируйте **anon public** ключ (длинный JWT токен)

### 2. Обновите .env.local

```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6enp6enp6enp6enp6enp6enp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5MTg1MzcsImV4cCI6MTk2MjQ5NDUzN30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**ВАЖНО:** Это должен быть ПОЛНЫЙ ключ, не обрезанный!

### 3. Обновите Railway

В Railway Dashboard → Variables:
- Найдите `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Замените на правильный ключ из Supabase
- Сохраните (Railway автоматически передеплоит)

### 4. Проверьте SERVICE_ROLE_KEY

Также проверьте `SUPABASE_SERVICE_ROLE_KEY`:
1. Supabase Dashboard → Settings → API
2. Скопируйте **service_role** ключ (секретный!)
3. Обновите в Railway

## 🧪 Тест

После обновления:

```bash
# Локально
npm run dev

# Откройте http://localhost:3000/login
# Попробуйте войти
```

Если всё работает локально, но не на Railway:
- Проверьте переменные в Railway Dashboard
- Проверьте логи в Railway
- Убедитесь, что деплой завершился успешно

## 📝 Правильный формат ключей

```bash
# ANON KEY (публичный, можно показывать)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6enp6enp6enp6enp6enp6enp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5MTg1MzcsImV4cCI6MTk2MjQ5NDUzN30.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# SERVICE ROLE KEY (секретный, НЕ показывать!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6enp6enp6enp6enp6enp6enp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0NjkxODUzNywiZXhwIjoxOTYyNDk0NTM3fQ.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

Оба ключа должны быть ПОЛНЫМИ JWT токенами (3 части разделённые точками).

## 🚀 Деплой

```bash
git add .
git commit -m "Fix Supabase auth error with non-ISO characters"
git push
```

Railway автоматически задеплоит изменения.

## ❓ Если ошибка осталась

1. Очистите кэш браузера (Ctrl+Shift+Delete)
2. Откройте в режиме инкогнито
3. Проверьте консоль браузера (F12)
4. Проверьте логи Railway
5. Убедитесь, что переменные окружения правильные

---

**Следующий шаг:** Обновите ключи в Railway и проверьте работу
