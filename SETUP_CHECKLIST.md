# Чеклист настройки Telegram авторизации

## ✅ Что уже сделано:

1. ✅ Установлены зависимости (`@supabase/supabase-js`, `jose`)
2. ✅ Создана структура API routes:
   - `/api/auth/telegram` - авторизация через Telegram
   - `/api/auth/me` - получение профиля пользователя
   - `/api/generations` - история генераций
3. ✅ Создан AuthContext для управления состоянием пользователя
4. ✅ Обновлён header с Telegram Login Widget
5. ✅ Обновлён API `/api/generate` для работы с авторизованными пользователями
6. ✅ Создана страница `/requisites` с реквизитами
7. ✅ Добавлены ссылки в footer
8. ✅ Создан компонент истории генераций

## ⚠️ Что нужно сделать вручную:

### 1. Установить зависимости
```bash
npm install @supabase/supabase-js jose
```

### 2. Создать бота в Telegram
1. Откройте @BotFather
2. `/newbot` → создайте бота
3. Скопируйте токен
4. `/setdomain` → укажите ваш домен (или `localhost`)

### 3. Настроить Supabase
1. Зайдите в https://app.supabase.com
2. Скопируйте URL и service_role key
3. Выполните SQL из файла `supabase-schema.sql` в SQL Editor

### 4. Заполнить .env.local
Уже добавлены переменные, нужно заменить значения:
```env
TELEGRAM_BOT_TOKEN=ваш_токен_от_botfather
NEXT_PUBLIC_SUPABASE_URL=https://zsmchferozuopiqhekyb.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ваш_service_role_key_здесь
JWT_SECRET=случайная_строка_минимум_32_символа
```

### 5. Обновить username бота
В файле `components/site-header.tsx` строка 67:
```tsx
data-telegram-login="YOUR_BOT_USERNAME"  // ← замените на username вашего бота
```

### 6. Добавить реквизиты
В файле `app/requisites/page.tsx` замените:
- ФИО
- ИНН
- Email
- Telegram

### 7. Создать файл oferta.pdf
Положите договор оферты в папку `public/oferta.pdf`

### 8. Перезапустить сервер
```bash
npm run dev
```

## 🎯 Как проверить что всё работает:

1. Откройте http://localhost:3000
2. В header должна быть кнопка "Войти через Telegram"
3. Нажмите на неё → авторизуйтесь
4. После авторизации в header должно показаться ваше имя и счётчик
5. Сгенерируйте описание → счётчик должен уменьшиться
6. Проверьте Supabase → в таблице `profiles` должна появиться запись
7. Проверьте Supabase → в таблице `generations` должна появиться запись

## 📝 Логика работы:

### Для неавторизованных:
- Используется localStorage счётчик (3 генерации)
- Сброс через 24 часа
- Paywall после 3 генераций

### Для авторизованных:
- Счётчик хранится в Supabase
- Автосброс через 24 часа
- История генераций сохраняется
- Если есть PRO (pro_until в будущем) → безлимит

## 🔧 Troubleshooting:

### Ошибка при установке зависимостей
```bash
npm install --legacy-peer-deps @supabase/supabase-js jose
```

### Telegram Widget не появляется
- Проверьте что скрипт загружается (F12 → Network)
- Проверьте что username бота правильный
- Проверьте что домен настроен в @BotFather

### Ошибка "Неверная подпись"
- Проверьте TELEGRAM_BOT_TOKEN в .env.local
- Убедитесь что нет лишних пробелов

### Пользователь не создаётся в Supabase
- Проверьте SUPABASE_SERVICE_ROLE_KEY (не anon key!)
- Проверьте что SQL схема выполнена
- Посмотрите логи в терминале

## 📚 Дополнительно:

- Подробная инструкция: `TELEGRAM_SETUP.md`
- SQL схема: `supabase-schema.sql`
- Документация Telegram Login: https://core.telegram.org/widgets/login
- Документация Supabase: https://supabase.com/docs
