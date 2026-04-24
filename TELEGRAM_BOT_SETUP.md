# 🤖 Настройка Telegram бота для авторизации

## Что уже есть

- Бот: @Telegagocod_bot
- Token: `8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU`

## Как работает авторизация

1. Пользователь нажимает "Войти через Telegram" на сайте
2. Открывается Telegram бот
3. Пользователь нажимает "Start"
4. Бот генерирует JWT токен и отправляет ссылку
5. Пользователь переходит по ссылке
6. Сайт сохраняет токен и авторизует пользователя

## Вариант 1: Простой (без сервера бота)

Используем Telegram Login Widget — встроенный виджет авторизации.

### Настройка в @BotFather

1. Открыть @BotFather
2. Отправить `/setdomain`
3. Выбрать `@Telegagocod_bot`
4. Указать домен: `descro-production.up.railway.app`

### Код уже готов

API роут `/api/auth/telegram` уже обрабатывает авторизацию.

## Вариант 2: Полноценный бот (рекомендуется)

Создадим простой бот на Node.js который будет:
- Принимать команду `/start`
- Генерировать токен авторизации
- Отправлять ссылку для входа

### Код бота (bot.js)

```javascript
const TelegramBot = require('node-telegram-bot-api');
const jwt = require('jsonwebtoken');

const BOT_TOKEN = '8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU';
const JWT_SECRET = 'descro_jwt_secret_change_this_to_random_string_min_32_chars';
const SITE_URL = 'https://descro-production.up.railway.app';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  // Генерируем JWT токен
  const token = jwt.sign(
    {
      telegram_id: user.id,
      username: user.username,
      first_name: user.first_name,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  // Создаём ссылку для авторизации
  const loginUrl = `${SITE_URL}/auth/callback?token=${token}`;

  // Отправляем сообщение с кнопкой
  await bot.sendMessage(chatId, 
    `👋 Привет, ${user.first_name}!\n\n` +
    `Нажми на кнопку ниже чтобы войти на сайт Descro:`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: '🔐 Войти на сайт', url: loginUrl }
        ]]
      }
    }
  );
});

console.log('Telegram bot started...');
```

### Установка зависимостей

```bash
npm install node-telegram-bot-api jsonwebtoken
```

### Запуск бота

```bash
node bot.js
```

### Деплой бота на Railway

1. Создать отдельный репозиторий для бота
2. Добавить `package.json`:
```json
{
  "name": "descro-telegram-bot",
  "version": "1.0.0",
  "main": "bot.js",
  "scripts": {
    "start": "node bot.js"
  },
  "dependencies": {
    "node-telegram-bot-api": "^0.66.0",
    "jsonwebtoken": "^9.0.2"
  }
}
```
3. Задеплоить на Railway
4. Добавить переменные окружения

## Вариант 3: Webhook (для продакшена)

Вместо polling можно использовать webhook:

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
  const update = req.body;
  
  if (update.message && update.message.text === '/start') {
    const user = update.message.from;
    // ... генерация токена и отправка сообщения
  }
  
  res.sendStatus(200);
});

app.listen(3000);
```

Установить webhook:
```bash
curl -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=https://your-bot-url.railway.app/webhook/${BOT_TOKEN}"
```

## Создание страницы callback

Нужно создать страницу `/auth/callback` которая примет токен:

```typescript
// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (token) {
      // Сохраняем токен
      localStorage.setItem('descro_token', token)
      
      // Перенаправляем на главную
      router.push('/')
    }
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">🔐</div>
        <h1 className="text-2xl font-bold">Авторизация...</h1>
        <p className="text-slate-600">Сейчас перенаправим вас на главную</p>
      </div>
    </div>
  )
}
```

## Тестирование

1. Запустить бот локально: `node bot.js`
2. Открыть @Telegagocod_bot в Telegram
3. Отправить `/start`
4. Нажать на кнопку "Войти на сайт"
5. Проверить что токен сохранился и пользователь авторизован

## Безопасность

- ✅ JWT токен подписан секретным ключом
- ✅ Токен действителен 30 дней
- ✅ Токен содержит только публичные данные (telegram_id, username)
- ✅ Проверка токена на сервере при каждом запросе

## Следующие шаги

1. Создать бота (выбрать вариант 1, 2 или 3)
2. Создать страницу `/auth/callback`
3. Протестировать авторизацию
4. Задеплоить бота на Railway (если вариант 2 или 3)

