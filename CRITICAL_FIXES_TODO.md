# 🔴 КРИТИЧЕСКИЕ ИСПРАВЛЕНИЯ - ПЛАН ДЕЙСТВИЙ

## ✅ ВЫПОЛНЕНО

### 1. История генераций в dashboard
- ✅ Добавлена таблица с историей последних 20 генераций
- ✅ Кнопка "Копировать" - копирует весь текст
- ✅ Кнопка "Удалить" - удаляет из БД
- ✅ Показывает дату и время создания
- ✅ API endpoint GET /api/generations
- ✅ API endpoint DELETE /api/generations/[id]

---

## 🔴 КРИТИЧНО - СДЕЛАТЬ СЕЙЧАС

### 2. Убрать `NODE_TLS_REJECT_UNAUTHORIZED=0` ⚠️ БЕЗОПАСНОСТЬ
**Проблема:** Отключена проверка SSL-сертификатов - уязвимость к MITM атакам

**Решение:**
```bash
# 1. Проверить сертификат GigaChat
curl -v https://gigachat.devices.sberbank.ru/api/v1

# 2. Если проблема в CA - добавить сертификат
# 3. Убрать NODE_TLS_REJECT_UNAUTHORIZED=0 из .env
```

**Файлы:**
- `.env.local` - удалить строку
- Railway env vars - удалить переменную

---

### 3. JWT в httpOnly cookies вместо localStorage ⚠️ БЕЗОПАСНОСТЬ
**Проблема:** localStorage доступен для XSS атак

**Решение:**
```typescript
// В API routes (login, register)
import { cookies } from 'next/headers'

// Установка cookie
cookies().set('auth_token', jwt, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 7 дней
})

// Чтение cookie
const token = cookies().get('auth_token')?.value
```

**Файлы для изменения:**
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/me/route.ts`
- `lib/auth-context.tsx`
- `components/auth-modal.tsx`
- Все компоненты, использующие `localStorage.getItem('descro_token')`

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
**SQL для Supabase:**
```sql
-- Включить RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Политика для чтения своих платежей
CREATE POLICY "Users can view own payments" 
ON payments FOR SELECT 
USING (auth.uid() = user_id);

-- Политика для webhook (service_role)
CREATE POLICY "Service role can manage all payments" 
ON payments FOR ALL 
USING (auth.role() = 'service_role');
```

**Файлы:**
- Создать `supabase-rls-policies.sql`
- Выполнить в Supabase SQL Editor

---

### 6. Добавить "Забыли пароль?" в AuthModal
**Решение:**
```typescript
// В components/auth-modal.tsx
const [resetEmail, setResetEmail] = useState('')
const [showReset, setShowReset] = useState(false)

const handlePasswordReset = async () => {
  // Отправить email через API
  await fetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email: resetEmail })
  })
  alert('Письмо отправлено на ' + resetEmail)
}
```

**Новый файл:**
- `app/api/auth/reset-password/route.ts`

---

### 7. Исправить кнопки тарифов на главной
**Файлы:**
- `components/pricing.tsx`

**Изменения:**
```typescript
// Кнопка "Попробовать"
onClick={() => {
  if (!user) {
    setShowAuth(true)
  } else {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }
}}

// Кнопка "Получить скидку"
onClick={() => {
  if (!user) {
    setShowAuth(true)
  } else if (isPro) {
    alert('PRO уже активен до ' + proUntil)
  } else {
    handlePurchase()
  }
}}
```

---

## 🟠 ВАЖНО - СДЕЛАТЬ НА ЭТОЙ НЕДЕЛЕ

### 8. Обработка ошибок GigaChat с retry
**Файл:** `app/api/generate/route.ts`

```typescript
async function callGigaChatWithRetry(prompt: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await callGigaChat(prompt)
    } catch (error: any) {
      if (error.status === 429) {
        // Rate limit - подождать
        await new Promise(r => setTimeout(r, 2000 * (i + 1)))
        continue
      }
      if (error.status >= 500 && i < retries) {
        // Server error - повторить
        await new Promise(r => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      throw error
    }
  }
}
```

---

### 9. Yandex.Metrica для аналитики
**Файл:** `app/layout.tsx`

```typescript
<Script id="yandex-metrika">
  {`
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(XXXXXX, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true
    });
  `}
</Script>
```

**Действия:**
1. Зарегистрироваться на https://metrika.yandex.ru
2. Создать счетчик
3. Получить ID
4. Вставить в layout.tsx

---

### 10. Email уведомления после оплаты
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

- ✅ 1/10 критических задач выполнено
- ⏳ 9 задач в работе
- 🎯 Цель: закрыть все 🔴 критичные за 2 дня

---

## 🚀 СЛЕДУЮЩИЕ ШАГИ

1. ✅ История генераций - ГОТОВО
2. 🔴 Убрать NODE_TLS_REJECT_UNAUTHORIZED=0
3. 🔴 JWT в httpOnly cookies
4. 🔴 Удалить ключи из документации
5. 🔴 Включить RLS для payments
6. 🔴 "Забыли пароль?"
7. 🔴 Исправить кнопки тарифов

**Приоритет:** Безопасность → UX → Аналитика
