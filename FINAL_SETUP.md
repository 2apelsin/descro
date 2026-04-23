# 🎯 Финальная настройка (5 минут)

## ✅ Что уже сделано:

1. ✅ Supabase credentials добавлены в `.env.local`
2. ✅ Telegram bot token добавлен
3. ✅ Зависимости установлены
4. ✅ Страницы для ЮKassa созданы:
   - `/requisites` - реквизиты и контакты
   - `/payment/success` - успешная оплата
   - `/payment/cancel` - отмена оплаты

## ⚠️ Осталось 3 шага:

### Шаг 1: Узнать username бота

1. Откройте @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Посмотрите username (например: `descro_bot`)

### Шаг 2: Обновить код

Откройте `components/site-header.tsx` и найдите строку 67:

```tsx
data-telegram-login="YOUR_BOT_USERNAME"
```

Замените на username вашего бота (БЕЗ @):

```tsx
data-telegram-login="descro_bot"
```

### Шаг 3: Настроить домен бота

1. В @BotFather отправьте `/setdomain`
2. Выберите вашего бота
3. Введите `localhost` (для разработки)

### Шаг 4: Выполнить SQL в Supabase

1. Откройте https://app.supabase.com
2. Выберите проект (zsmchferozuopiqhekyb)
3. SQL Editor → New Query
4. Скопируйте весь код из `supabase-schema.sql`
5. Нажмите RUN

Это создаст таблицы `profiles` и `generations`.

### Шаг 5: Заполнить реквизиты

Откройте `app/requisites/page.tsx` и замените:
- `[Ваши ФИО]` → ваши реальные ФИО
- `[Ваш ИНН]` → ваш ИНН самозанятого
- `@YOUR_TELEGRAM` → ваш Telegram username

### Шаг 6: Создать оферту

1. Зайдите на https://oferta-generator.ru или https://kontur.ru/oferta
2. Заполните:
   - ФИО и ИНН
   - Название: Descro
   - Цена: 299 ₽/месяц
   - Товар: Доступ к веб-сервису генерации описаний
   - Способ получения: Автоматическая активация в личном кабинете
3. Скачайте PDF
4. Положите в `public/oferta.pdf`

### Шаг 7: Перезапустить сервер

```bash
npm run dev
```

## ✅ Проверка

1. Откройте http://localhost:3000
2. Должна быть кнопка Telegram в header
3. Нажмите → авторизуйтесь
4. После авторизации должно показаться ваше имя
5. Сгенерируйте описание → счётчик уменьшится
6. Проверьте страницы:
   - http://localhost:3000/requisites
   - http://localhost:3000/payment/success
   - http://localhost:3000/payment/cancel

## 📋 Для ЮKassa нужно:

1. ✅ Главная с тарифами (уже есть)
2. ✅ Страница `/requisites` (создана)
3. ✅ Файл `/oferta.pdf` (нужно создать)
4. ✅ Страницы success/cancel (созданы)
5. ✅ Описание способа получения (добавлено в requisites)

## 🚀 Готово!

После этих шагов:
- Telegram авторизация работает
- Все страницы для ЮKassa готовы
- Можно подавать заявку на подключение ЮKassa
