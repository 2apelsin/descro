# 🚀 Деплой прямо сейчас (5 минут)

## Что нужно сделать:

### 1️⃣ Открыть Railway (1 мин)

1. Перейти на https://railway.app
2. Войти через GitHub
3. Нажать "New Project"
4. Выбрать "Deploy from GitHub repo"
5. Выбрать репозиторий `2apelsin/descro`

Railway автоматически начнет деплой.

---

### 2️⃣ Добавить переменные окружения (2 мин)

1. В Railway Dashboard открыть проект
2. Перейти в Variables
3. Нажать "Raw Editor"
4. Вставить:

```env
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzbw==.SRGNcYBxzW1_AxvnHeXfSqXuSrbUpFlqtpBFyc_RNKkC1SDrq85Fhw
GIGACHAT_CLIENT_SECRET=MDE5ZGJiMzUtOTI4MS03MWNkLTk1NzQtM2QyYjFkZTRjY2ZhOjljMWNmNGUyLTI5YmYtNGQ2OS05MDIwLTc1Mzg1OTkwMjE1NA
NODE_TLS_REJECT_UNAUTHORIZED=0
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU
NEXT_PUBLIC_APP_URL=https://descro-production.up.railway.app
YOOKASSA_SHOP_ID=your_shop_id_here
YOOKASSA_SECRET_KEY=your_secret_key_here
```

5. Сохранить

Railway автоматически пересоберет проект (займет 2-3 минуты).

---

### 3️⃣ Получить домен (30 сек)

1. В Railway Dashboard → Settings → Domains
2. Скопировать домен (например: `descro-production.up.railway.app`)

---

### 4️⃣ Проверить работу (1 мин)

1. Открыть домен Railway в браузере
2. Попробовать сгенерировать описание товара
3. Убедиться что GigaChat работает

---

### 5️⃣ Обновить Telegram бота (30 сек)

1. Открыть @BotFather в Telegram
2. Отправить `/setdomain`
3. Выбрать `@Telegagocod_bot`
4. Указать домен Railway (БЕЗ `https://`)

Например: `descro-production.up.railway.app`

---

## ✅ Готово!

Сайт задеплоен и работает. Теперь можно:

1. Добавить ИНН в `/requisites`
2. Создать оферту
3. Подать заявку в ЮKassa

---

## 🆘 Проблемы?

- **Ошибка при сборке**: проверьте что все переменные добавлены
- **GigaChat не работает**: убедитесь что `NODE_TLS_REJECT_UNAUTHORIZED=0` есть
- **404 на API**: Railway правильно собирает Next.js, подождите завершения деплоя

Логи: Railway Dashboard → Deployments → View Logs

