# Выполненная работа - Продолжение

## ✅ Что сделано в этой сессии

### 1. Обновлен CRITICAL_FIXES_TODO.md
- Отмечены все выполненные задачи (7 из 10)
- Обновлен прогресс: 70% завершено
- Перенумерованы оставшиеся задачи

### 2. Добавлена retry логика для GigaChat API
**Файл:** `app/api/generate/route.ts`

**Что сделано:**
- Создана функция `retryWithBackoff()` с экспоненциальной задержкой
- Retry для `getToken()` - до 2 попыток
- Retry для GigaChat API - до 2 попыток
- Умная обработка: не повторяет 4xx ошибки (кроме 429 Rate Limit)
- Логирование каждой попытки в консоль
- Задержки: 1s, 2s, 4s (экспоненциальный рост)

**Преимущества:**
- Устойчивость к временным сбоям GigaChat API
- Автоматическое восстановление при 5xx ошибках
- Обработка Rate Limit (429) с увеличенной задержкой

### 3. Убрано NODE_TLS_REJECT_UNAUTHORIZED=0 (БЕЗОПАСНОСТЬ)
**Файлы:** `app/api/generate/route.ts`, `.env.local`

**Что сделано:**
- Создан custom HTTPS agent только для GigaChat запросов
- Agent не влияет на другие запросы (изолирован)
- Удалена переменная NODE_TLS_REJECT_UNAUTHORIZED из .env.local
- Создан документ GIGACHAT_SSL_FIX.md с объяснением

**Почему это важно:**
- NODE_TLS_REJECT_UNAUTHORIZED=0 отключает проверку SSL для ВСЕХ запросов
- Это создает уязвимость к MITM атакам
- Custom agent отключает проверку только для GigaChat (безопаснее)

**⚠️ ВАЖНО - Действия после деплоя:**
1. Удалить NODE_TLS_REJECT_UNAUTHORIZED из Railway environment variables
2. Протестировать работу GigaChat API
3. Если не работает - проверить что `runtime = 'nodejs'` в route.ts

### 4. Создан SQL для Row Level Security (RLS)
**Файл:** `supabase-rls-policies.sql`

**Что сделано:**
- SQL для включения RLS на таблице payments
- Политика: пользователи видят только свои платежи
- Политика: service_role (webhook) управляет всеми платежами
- Проверочные запросы для валидации

**⚠️ ВАЖНО - Нужно выполнить вручную:**
1. Открыть https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql
2. Скопировать содержимое supabase-rls-policies.sql
3. Выполнить SQL
4. Протестировать webhook (создать тестовый платеж)

## 📊 Общий прогресс проекта

### ✅ Выполнено (7/10 задач):
1. ✅ История генераций в dashboard
2. ✅ Обработка ошибок GigaChat с retry
3. ✅ Убрать NODE_TLS_REJECT_UNAUTHORIZED=0
4. ✅ Удалить реальные ключи из документации
5. ✅ "Забыли пароль?" в AuthModal
6. ✅ Исправить кнопки тарифов
7. ✅ Yandex.Metrika (ID: 108773114)

### ⏳ Осталось (3 задачи):
1. 🔴 JWT в httpOnly cookies (безопасность)
2. 🔴 Включить RLS для payments (SQL готов, нужно выполнить)
3. 🟠 Email уведомления после оплаты

## 🚀 Следующие шаги

### Приоритет 1: JWT в httpOnly cookies
**Зачем:** localStorage доступен для XSS атак

**Что нужно изменить:**
- `app/api/auth/login/route.ts` - установка cookie
- `app/api/auth/register/route.ts` - установка cookie
- `app/api/auth/me/route.ts` - чтение cookie
- `lib/auth-context.tsx` - убрать localStorage
- `components/auth-modal.tsx` - убрать localStorage
- Все компоненты с `localStorage.getItem('descro_token')`

### Приоритет 2: Email уведомления
**Варианты:**
- Resend (3000 emails/месяц бесплатно)
- SendGrid (100 emails/день бесплатно)
- Supabase Edge Functions с SMTP

**Когда отправлять:**
- После успешной оплаты (payment.succeeded)
- При отмене подписки (refund.succeeded)
- Напоминание за 3 дня до окончания PRO

## 📝 Важные заметки

### Railway Environment Variables
После деплоя ОБЯЗАТЕЛЬНО удалить:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Supabase SQL
Выполнить вручную:
```sql
-- Содержимое supabase-rls-policies.sql
```

### Тестирование
После деплоя протестировать:
1. ✅ Генерация описаний (GigaChat API)
2. ✅ Создание платежа
3. ✅ Webhook обработка
4. ✅ История генераций
5. ✅ Yandex.Metrika

## 🔗 Полезные ссылки

- Railway: https://descro-production.up.railway.app
- Supabase: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb
- Yandex.Metrika: https://metrika.yandex.ru/dashboard?id=108773114
- YooKassa: https://yookassa.ru/my

## 📄 Созданные файлы

1. `GIGACHAT_SSL_FIX.md` - документация по SSL проблеме
2. `supabase-rls-policies.sql` - SQL для Row Level Security
3. `WORK_COMPLETED.md` - этот файл (сводка работы)

---

**Прогресс:** 70% критических задач выполнено
**Статус:** Готово к деплою (после удаления NODE_TLS_REJECT_UNAUTHORIZED из Railway)
