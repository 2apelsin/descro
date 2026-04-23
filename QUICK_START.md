# 🚀 Быстрый старт Telegram авторизации

## Шаг 1: Получить Supabase Service Role Key

1. Откройте https://app.supabase.com
2. Выберите проект (zsmchferozuopiqhekyb)
3. Settings → API
4. Скопируйте **service_role** key (НЕ anon key!)
5. Вставьте в `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

## Шаг 2: Выполнить SQL в Supabase

1. В Supabase перейдите: SQL Editor
2. Скопируйте весь код из файла `supabase-schema.sql`
3. Вставьте и нажмите RUN
4. Должно создаться 2 таблицы: `profiles` и `generations`

## Шаг 3: Узнать username бота

1. Откройте @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите "API Token" - там будет показан username (например: `descro_bot`)

## Шаг 4: Обновить код

Откройте `components/site-header.tsx` и замените строку 67:

```tsx
data-telegram-login="YOUR_BOT_USERNAME"
```

На:

```tsx
data-telegram-login="ваш_username_бота"
```

Например:
```tsx
data-telegram-login="descro_bot"
```

## Шаг 5: Настроить домен бота

1. Откройте @BotFather
2. Отправьте `/setdomain`
3. Выберите вашего бота
4. Введите: `localhost` (для разработки)

## Шаг 6: Перезапустить сервер

```bash
npm run dev
```

## ✅ Проверка

1. Откройте http://localhost:3000
2. В header должна быть синяя кнопка Telegram
3. Нажмите → авторизуйтесь
4. После авторизации должно показаться ваше имя
5. Сгенерируйте описание → счётчик уменьшится

## 🐛 Если не работает

### Кнопка Telegram не появляется
- Проверьте что username бота правильный в `site-header.tsx`
- Откройте F12 → Console, посмотрите ошибки

### Ошибка "Bot domain invalid"
- Выполните `/setdomain` в @BotFather
- Укажите `localhost` (без http://)

### Ошибка "Неверная подпись"
- Проверьте `TELEGRAM_BOT_TOKEN` в `.env.local`
- Убедитесь что токен правильный

### Пользователь не создаётся
- Проверьте `SUPABASE_SERVICE_ROLE_KEY` (должен быть service_role, не anon!)
- Проверьте что SQL выполнен
- Посмотрите логи в терминале сервера

## 📝 Что дальше?

После успешной авторизации:
- Счётчик генераций хранится в Supabase
- История сохраняется в таблице `generations`
- Можно добавить PRO статус через поле `pro_until`
