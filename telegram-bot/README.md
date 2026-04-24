# Descro Telegram Bot

Бот для авторизации пользователей на сайте Descro.

## Установка

```bash
npm install
```

## Запуск локально

```bash
npm start
```

## Переменные окружения

```env
TELEGRAM_BOT_TOKEN=8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU
JWT_SECRET=descro_jwt_secret_change_this_to_random_string_min_32_chars
SITE_URL=https://descro-production.up.railway.app
```

## Деплой на Railway

1. Создать новый проект на Railway
2. Подключить этот репозиторий (папку telegram-bot)
3. Добавить переменные окружения
4. Railway автоматически запустит бота

## Команды бота

- `/start` — Войти на сайт
- `/help` — Справка

## Как работает

1. Пользователь отправляет `/start`
2. Бот генерирует JWT токен
3. Бот отправляет ссылку с токеном
4. Пользователь переходит по ссылке
5. Сайт сохраняет токен и авторизует пользователя

