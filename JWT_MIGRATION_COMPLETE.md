# JWT Migration: localStorage → httpOnly Cookies ✅

## Что сделано

### 1. API Routes обновлены
- ✅ `/api/auth/login` - устанавливает httpOnly cookie
- ✅ `/api/auth/register` - устанавливает httpOnly cookie
- ✅ `/api/auth/me` - читает из cookie (приоритет) или header
- ✅ `/api/auth/logout` - новый endpoint для удаления cookie

### 2. Защищенные API обновлены
- ✅ `/api/generate` - читает токен из cookie или header
- ✅ `/api/payment/create` - читает токен из cookie или header
- ✅ `/api/generations` - читает токен из cookie или header

### 3. Frontend компоненты обновлены
- ✅ `lib/auth-context.tsx` - убран localStorage, используется credentials: 'include'
- ✅ `components/auth-modal.tsx` - убран localStorage
- ✅ `components/demo-form.tsx` - убран localStorage
- ✅ `components/pricing.tsx` - убран localStorage
- ✅ `components/generation-history.tsx` - убран localStorage

### 4. Новые файлы
- ✅ `lib/api-client.ts` - helper функции для API запросов
- ✅ `app/api/auth/logout/route.ts` - endpoint для выхода

## Настройки Cookie

```typescript
{
  httpOnly: true,              // Недоступен для JavaScript (защита от XSS)
  secure: NODE_ENV === 'production', // Только HTTPS в production
  sameSite: 'lax',            // Защита от CSRF
  maxAge: 60 * 60 * 24 * 30,  // 30 дней
  path: '/'                    // Доступен на всех страницах
}
```

## Обратная совместимость

Все API endpoints поддерживают оба метода:
1. **Приоритет:** httpOnly cookie `auth_token`
2. **Fallback:** Authorization header `Bearer <token>`

Это позволяет плавную миграцию без breaking changes.

## Преимущества

### До (localStorage):
```typescript
// ❌ Уязвимо к XSS атакам
localStorage.setItem('descro_token', token)
const token = localStorage.getItem('descro_token')
```

### После (httpOnly cookies):
```typescript
// ✅ Защищено от XSS
// Cookie устанавливается сервером
response.cookies.set('auth_token', token, { httpOnly: true })

// ✅ Браузер отправляет автоматически
fetch('/api/auth/me', { credentials: 'include' })
```

## Что нужно протестировать

### 1. Регистрация
```bash
# Должна установить cookie auth_token
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

# Проверить в DevTools → Application → Cookies
# Должен быть auth_token с флагом HttpOnly
```

### 2. Вход
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# Проверить cookie установлен
```

### 3. Проверка профиля
```bash
GET /api/auth/me
# Должен вернуть данные пользователя без Authorization header
```

### 4. Генерация описания
```bash
POST /api/generate
{
  "name": "Тестовый товар",
  "category": "Электроника"
}

# Должна работать без Authorization header
# Должна уменьшить generations_left
```

### 5. Создание платежа
```bash
POST /api/payment/create
# Должен создать платеж без Authorization header
```

### 6. История генераций
```bash
GET /api/generations
# Должна вернуть историю без Authorization header
```

### 7. Выход
```bash
POST /api/auth/logout
# Должен удалить cookie
# После этого GET /api/auth/me должен вернуть 401
```

## Миграция старых пользователей

Старые токены в localStorage будут работать через fallback механизм:
1. API проверяет cookie
2. Если нет cookie - проверяет Authorization header
3. Пользователь может продолжать работу

При следующем входе установится cookie и localStorage больше не нужен.

## Проблемы и решения

### Проблема: Cookie не отправляется
**Решение:** Добавить `credentials: 'include'` во все fetch запросы

```typescript
fetch('/api/auth/me', {
  credentials: 'include' // ✅ Обязательно!
})
```

### Проблема: Cookie не устанавливается
**Решение:** Проверить что домен совпадает (localhost или production)

### Проблема: CORS ошибки
**Решение:** В production убедиться что frontend и backend на одном домене

## Безопасность

### ✅ Защита от XSS
httpOnly cookie недоступен для JavaScript, даже если злоумышленник внедрит скрипт.

### ✅ Защита от CSRF
sameSite: 'lax' защищает от большинства CSRF атак.

### ✅ Secure в production
Cookie передается только по HTTPS в production.

## Следующие шаги

1. ⚠️ Удалить NODE_TLS_REJECT_UNAUTHORIZED из Railway env vars
2. ⚠️ Протестировать все сценарии после деплоя
3. ⚠️ Выполнить supabase-rls-policies.sql в Supabase
4. 🟠 Добавить email уведомления после оплаты

## Файлы изменены

### API Routes
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/logout/route.ts` (новый)
- `app/api/generate/route.ts`
- `app/api/payment/create/route.ts`
- `app/api/generations/route.ts`

### Components
- `lib/auth-context.tsx`
- `lib/api-client.ts` (новый)
- `components/auth-modal.tsx`
- `components/demo-form.tsx`
- `components/pricing.tsx`
- `components/generation-history.tsx`

### Documentation
- `CRITICAL_FIXES_TODO.md`
- `JWT_MIGRATION_COMPLETE.md` (этот файл)

---

**Статус:** ✅ Миграция завершена, готово к тестированию
**Прогресс:** 8/10 критических задач выполнено (80%)
