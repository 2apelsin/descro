# ⚡ Быстрое исправление ошибки

## ✅ Что исправлено

Убрал кириллицу из сообщений об ошибках в `app/login/page.tsx`.
Изменения уже на GitHub.

## 🔑 Что нужно сделать СЕЙЧАС

### 1. Получите правильный Supabase ANON KEY

1. Откройте: https://supabase.com/dashboard
2. Выберите проект
3. Settings → API
4. Скопируйте **anon public** ключ (длинный токен)

### 2. Обновите Railway

1. Откройте Railway Dashboard
2. Выберите ваш проект
3. Variables
4. Найдите `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Вставьте ПОЛНЫЙ ключ из Supabase
6. Сохраните

Railway автоматически передеплоит.

### 3. Проверьте

Откройте сайт через 1-2 минуты после деплоя.

## 📋 Проверьте эти переменные в Railway

```
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (ПОЛНЫЙ ключ)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (ПОЛНЫЙ ключ)
```

Оба ключа должны начинаться с `eyJ` и быть очень длинными (JWT токены).

---

**Подробнее:** `FIX_SUPABASE_ERROR.md`
