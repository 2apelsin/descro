# Настройка Telegram авторизации

## 1. Создайте бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Введите имя бота (например: `Descro Bot`)
4. Введите username бота (например: `descro_auth_bot`)
5. Скопируйте токен бота (формат: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 2. Настройте домен для авторизации

1. Отправьте команду `/setdomain` в @BotFather
2. Выберите вашего бота
3. Введите домен (например: `descro.ru` или `localhost` для разработки)

## 3. Добавьте токен в .env.local

```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
```

## 4. Настройте Supabase

1. Зайдите в [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Скопируйте:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

5. Добавьте в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key
JWT_SECRET=случайная_строка_для_jwt
```

## 5. Создайте таблицы в Supabase

1. Перейдите в SQL Editor
2. Скопируйте содержимое файла `supabase-schema.sql`
3. Выполните SQL запрос

## 6. Обновите username бота в коде

В файле `components/site-header.tsx` замените `YOUR_BOT_USERNAME` на username вашего бота:

```tsx
data-telegram-login="ваш_bot_username"
```

## 7. Перезапустите сервер

```bash
npm run dev
```

Теперь кнопка "Войти через Telegram" должна работать!

## Проверка

1. Откройте сайт
2. Нажмите кнопку "Войти через Telegram"
3. Авторизуйтесь
4. Проверьте что в header показывается ваше имя
5. Попробуйте сгенерировать описание - счётчик должен уменьшиться

## Troubleshooting

### Ошибка "Bot domain invalid"
- Убедитесь что вы настроили домен через `/setdomain` в @BotFather
- Для localhost используйте `localhost` без `http://`

### Ошибка "Неверная подпись"
- Проверьте что `TELEGRAM_BOT_TOKEN` правильный
- Убедитесь что токен не содержит лишних пробелов

### Не создаётся пользователь в Supabase
- Проверьте что SQL схема выполнена
- Проверьте `SUPABASE_SERVICE_ROLE_KEY` (не anon key!)
- Посмотрите логи в терминале сервера
