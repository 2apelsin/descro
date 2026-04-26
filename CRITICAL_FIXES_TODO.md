# 🔴 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ - ПЛАН ДЕЙСТВИЙ

## ✅ ВЫПОЛНЕНО

### 1. История генераций в dashboard
- ✅ Добавлена таблица с историей последних 20 генераций
- ✅ Кнопка "Копировать" - копирует весь текст
- ✅ Кнопка "Удалить" - удаляет из БД
- ✅ Показывает дата и время создания
- ✅ API endpoint GET /api/generations
- ✅ API endpoint DELETE /api/generations/[id]

### 4. Удалить реальные ключи из документации ⚠️ БЕЗОПАСНОСТЬ
- ✅ Заменены все реальные ключи на placeholders
- ✅ Обновлены: PROJECT_OVERVIEW.md, CREDENTIALS.md, VERCEL_DEPLOY.md
- ✅ Обновлены: GIGACHAT_SETUP.md, PAYMENT_FIXED.md, PAYMENT_DEBUG.md
- ✅ Создан SECURITY.md с best practices
- ✅ Проверен .gitignore

### 6. Добавить "Забыли пароль?" в AuthModal
- ✅ Добавлена форма восстановления пароля
- ✅ Создан API endpoint /api/auth/reset-password
- ✅ Показывается предупреждение при регистрации о сохранении пароля

### 7. Исправить кнопки тарифов на главной
- ✅ "Попробовать" - открывает auth modal или скроллит к demo
- ✅ "Получить скидку" - открывает auth modal или создает платеж
- ✅ Проверка статуса PRO перед оплатой
- ✅ Event listener для открытия auth modal из header

### 9. Yandex.Metrica для аналитики
- ✅ Создан компонент YandexMetrika
- ✅ Интегрирован в app/layout.tsx
- ✅ ID счетчика: 108773114
- ✅ Включены: clickmap, trackLinks, accurateTrackBounce, webvisor, ecommerce
- ✅ Создан YANDEX_METRIKA_SETUP.md

---

## 🔴 КРИТИЧНО - СДЕЛАТЬ СЕЙЧАС

### 2. Обработка ошибок GigaChat с retry логикой
- ✅ Добавлена функция retryWithBackoff с экспоненциальной задержкой
- ✅ Retry для getToken() - до 2 попыток
- ✅ Retry для GigaChat API - до 2 попыток
- ✅ Умная обработка: не повторяет 4xx ошибки (кроме 429)
- ✅ Логирование попыток в консоль
- ✅ Экспоненциальная задержка: 1s, 2s, 4s...

---

### 3. Убрать `NODE_TLS_REJECT_UNAUTHORIZED=0` ⚠️ БЕЗОПАСНОСТЬ
- ✅ Создан custom HTTPS agent только для GigaChat
- ✅ Agent не влияет на другие запросы (безопаснее)
- ✅ Удалено NODE_TLS_REJECT_UNAUTHORIZED=0 из .env.local
- ✅ Создан GIGACHAT_SSL_FIX.md с документацией
- ⚠️ ВАЖНО: Удалить NODE_TLS_REJECT_UNAUTHORIZED из Railway env vars
- ⚠️ ВАЖНО: Протестировать работу после деплоя

---

### 4. JWT в httpOnly cookies вместо localStorage ⚠️ БЕЗОПАСНОСТЬ
- ✅ Обновлены API routes: login, register, me, logout
- ✅ Cookies устанавливаются с httpOnly, secure, sameSite
- ✅ Обновлен auth-context.tsx - убран localStorage
- ✅ Обновлен auth-modal.tsx - убран localStorage
- ✅ Обновлены компоненты: demo-form, pricing, generation-history
- ✅ Обновлены API: /api/generate, /api/payment/create, /api/generations
- ✅ Поддержка обратной совместимости (читает из header если нет cookie)
- ✅ Создан lib/api-client.ts с helper функциями
- ⚠️ ВАЖНО: Протестировать после деплоя (login, register, генерация, платеж)

---

### 4. Удалить реальные ключи из документации ⚠️ БЕЗОПАСНОСТЬ
**Файлы для очистки:**
- `PROJECT_OVERVIEW.md` - заменить на placeholders
- `CREDENTIALS.md` - удалить или добавить в .gitignore
- `.env.local` - добавить в .gitignore (если еще нет)
- Все MD файлы с примерами

**Действия:**
```bash
# 1. Найти все упоминания ключей
grep -r "GIGACHAT_CLIENT_SECRET" .
grep -r "YOOKASSA_SECRET_KEY" .

# 2. Заменить на placeholders
# 3. Проверить git history - возможно нужно удалить из истории
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch CREDENTIALS.md" \
  --prune-empty --tag-name-filter cat -- --all
```

---

### 5. Включить RLS для payments ⚠️ БЕЗОПАСНОСТЬ
- ✅ Создан файл supabase-rls-policies.sql
- ✅ Политика: пользователи видят только свои платежи
- ✅ Политика: service_role управляет всеми платежами (для webhook)
- ⚠️ ВАЖНО: Выполнить SQL в Supabase SQL Editor
- ⚠️ ВАЖНО: Протестировать работу webhook после включения RLS

**Инструкция:**
1. Открыть https://supabase.com/dashboard/project/zsmchferozuopiqhekyb/sql
2. Скопировать содержимое supabase-rls-policies.sql
3. Выполнить SQL
4. Проверить что webhook работает (создать тестовый платеж)

---

## 🟠 ВАЖНО - СДЕЛАТЬ НА ЭТОЙ НЕДЕЛЕ

### 6. Email уведомления после оплаты
**Опции:**
1. **Resend** (https://resend.com) - 3000 emails/месяц бесплатно
2. **SendGrid** - 100 emails/день бесплатно
3. **Supabase Edge Functions** с SMTP

**Файл:** `app/api/payment/webhook/route.ts`

```typescript
// После активации PRO
await sendEmail({
  to: userEmail,
  subject: 'PRO подписка активирована!',
  html: `
    <h1>Спасибо за покупку!</h1>
    <p>Ваша PRO подписка активна до ${proUntil}</p>
  `
})
```

---

## 🟡 ЖЕЛАТЕЛЬНО - ПОТОМ

### 11. Sentry для мониторинга ошибок
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 12. Базовые тесты
```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### 13. Миграции БД через Supabase CLI
```bash
npx supabase init
npx supabase migration new initial_schema
```

---

## 📊 ПРОГРЕСС

- ✅ 8/10 критических задач выполнено (80%)
- ⏳ 2 задачи осталось
- 🎯 Осталось: RLS в Supabase + Email уведомления

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. ✅ История генераций - ГОТОВО
2. ✅ Обработка ошибок GigaChat с retry - ГОТОВО
3. ✅ Убрать NODE_TLS_REJECT_UNAUTHORIZED=0 - ГОТОВО (нужно удалить из Railway)
4. ✅ JWT в httpOnly cookies - ГОТОВО (нужно протестировать)
5. 🔴 Включить RLS для payments - SQL ГОТОВ (нужно выполнить в Supabase)
6. ✅ "Забыли пароль?" - ГОТОВО
7. ✅ Исправить кнопки тарифов - ГОТОВО
8. ✅ Удалить ключи из документации - ГОТОВО
9. ✅ Yandex.Metrika - ГОТОВО
10. 🟠 Email уведомления после оплаты - СЛЕДУЮЩАЯ ЗАДАЧА

**Приоритет:** Тестирование → RLS → Email
