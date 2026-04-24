# 🚂 Railway Deployment Guide

## Почему Railway, а не Vercel?

Vercel не поддерживает `NODE_TLS_REJECT_UNAUTHORIZED=0`, который нужен для GigaChat API.
Railway позволяет устанавливать любые переменные окружения.

---

## Шаг 1: Создать проект на Railway

1. Зайти на https://railway.app
2. Войти через GitHub
3. Нажать "New Project" → "Deploy from GitHub repo"
4. Выбрать репозиторий `2apelsin/descro`
5. Railway автоматически определит Next.js и начнет деплой

---

## Шаг 2: Добавить переменные окружения

В настройках проекта Railway → Variables → Raw Editor вставить:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzbw==.SRGNcYBxzW1_AxvnHeXfSqXuSrbUpFlqtpBFyc_RNKkC1SDrq85Fhw
GIGACHAT_CLIENT_SECRET=MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA
NODE_TLS_REJECT_UNAUTHORIZED=0
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU
```

**ВАЖНО:** После добавления переменных Railway автоматически пересоберет проект.

---

## Шаг 3: Получить домен

1. В настройках проекта → Settings → Domains
2. Railway автоматически создаст домен типа `descro-production.up.railway.app`
3. Можно добавить свой домен (опционально)

---

## Шаг 4: Проверить деплой

1. Открыть домен Railway
2. Проверить что сайт загружается
3. Попробовать сгенерировать описание
4. Проверить что GigaChat работает

---

## Шаг 5: Обновить Telegram бота

После успешного деплоя:

1. Открыть @BotFather в Telegram
2. Отправить `/setdomain`
3. Выбрать бота `@Telegagocod_bot`
4. Указать домен Railway (например: `descro-production.up.railway.app`)

---

## Troubleshooting

### Ошибка "supabaseUrl is required"
- Убедитесь что добавили `NEXT_PUBLIC_SUPABASE_URL` в переменные
- Railway должен автоматически пересобрать проект

### GigaChat не работает
- Проверьте что `NODE_TLS_REJECT_UNAUTHORIZED=0` добавлена
- Проверьте что `GIGACHAT_CLIENT_SECRET` правильный

### 404 на API routes
- Railway правильно собирает Next.js, в отличие от Vercel
- Если проблема осталась, проверьте логи в Railway Dashboard

---

## Полезные ссылки

- Railway Dashboard: https://railway.app/dashboard
- Логи: Railway Dashboard → Deployments → View Logs
- Переменные: Railway Dashboard → Variables

---

## Следующие шаги

После успешного деплоя:

1. ✅ Обновить домен бота в @BotFather
2. ✅ Добавить ИНН в `/requisites`
3. ✅ Создать оферту и положить в `public/oferta.pdf`
4. ✅ Подать заявку в ЮKassa

