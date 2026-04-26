# 🚀 Деплой на Vercel

## Проблема: GigaChat не работает на Vercel

На Vercel сайт не работает потому что:
1. `NODE_TLS_REJECT_UNAUTHORIZED=0` не работает на Vercel (запрещено)
2. GigaChat API использует самоподписанные сертификаты

## Решение: Использовать прокси или VPS

### Вариант 1: Деплой на VPS (рекомендуется)

Используй любой VPS (DigitalOcean, Hetzner, Timeweb):

```bash
# На сервере
git clone ваш_репозиторий
cd descro
npm install
npm run build

# Создай .env.local с переменными
nano .env.local

# Запусти через PM2
npm install -g pm2
pm2 start npm --name "descro" -- start
pm2 save
pm2 startup
```

### Вариант 2: Railway.app

Railway поддерживает `NODE_TLS_REJECT_UNAUTHORIZED=0`:

1. Зайди на https://railway.app
2. New Project → Deploy from GitHub
3. Выбери репозиторий
4. Добавь Environment Variables из `.env.local`
5. Deploy

### Вариант 3: Render.com

1. Зайди на https://render.com
2. New → Web Service
3. Connect GitHub
4. Добавь Environment Variables
5. Deploy

## Переменные окружения для продакшна

```env
# GigaChat
GIGACHAT_CLIENT_ID=your_client_id_here
GIGACHAT_CLIENT_SECRET=your_client_secret_here
NODE_TLS_REJECT_UNAUTHORIZED=0

# Telegram
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzbw==.SRGNcYBxzW1_AxvnHeXfSqXuSrbUpFlqtpBFyc_RNKkC1SDrq85Fhw

# JWT
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars
```

## После деплоя

1. **Обнови домен в @BotFather**:
   - `/setdomain`
   - Выбери @Telegagocod_bot
   - Введи `descro.vercel.app` (или твой домен)

2. **Проверь что работает**:
   - Открой сайт
   - Попробуй сгенерировать описание
   - Проверь что GigaChat работает (не mock)

3. **Если GigaChat не работает на Vercel**:
   - Используй Railway или VPS
   - Или создай прокси API на отдельном сервере

## Рекомендация

Для продакшна лучше использовать **Railway.app** или **VPS**, потому что Vercel не поддерживает отключение проверки SSL сертификатов.
