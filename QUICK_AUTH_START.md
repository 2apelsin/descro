# ⚡ Быстрый старт - 5 минут

## 1️⃣ Supabase (2 минуты)

```bash
# 1. Откройте Supabase Dashboard
# 2. SQL Editor → New Query
# 3. Скопируйте весь код из supabase-migration.sql
# 4. Run
# 5. Settings → API → Скопируйте anon key
```

Добавьте в `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2️⃣ Telegram Bot (1 минута)

```bash
# 1. Откройте @BotFather
# 2. Найдите username вашего бота (БЕЗ @)
```

Добавьте в `.env.local`:
```bash
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ваш_бот
```

В @BotFather:
```
/setdomain
→ Выберите бота
→ descro-production.up.railway.app
```

## 3️⃣ ЮKassa (2 минуты)

Если уже зарегистрированы:
```bash
# 1. Личный кабинет → Настройки → API
# 2. Скопируйте Shop ID и Secret Key
```

Добавьте в `.env.local`:
```bash
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=live_abc123...
```

Настройте webhook:
- URL: `https://descro-production.up.railway.app/api/payment/webhook`
- События: `payment.succeeded`

## 4️⃣ Деплой

```bash
git add .
git commit -m "Add auth system"
git push
```

В Railway добавьте переменные из `.env.local`

## 5️⃣ Тест

1. Откройте сайт
2. Сделайте 3 генерации
3. Нажмите "Войти"
4. Войдите через Telegram
5. Готово! ✅

---

**Полная инструкция:** `SETUP_AUTH_SYSTEM.md`
**Чеклист:** `AUTH_CHECKLIST.md`
**Интеграция:** `INTEGRATION_GUIDE.md`
