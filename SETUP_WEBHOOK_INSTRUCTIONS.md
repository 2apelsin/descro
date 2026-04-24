# 🚀 ИНСТРУКЦИЯ: Настройка Webhook для Telegram бота

## Проблема
Telegram API заблокирован в России, поэтому команды не выполняются локально.

## ✅ РЕШЕНИЕ

Webhook настроится автоматически при первом запросе от Telegram после деплоя на Railway.

### Что уже сделано:

1. ✅ Создан webhook endpoint: `/api/telegram/webhook`
2. ✅ Код загружен на GitHub
3. ✅ Railway автоматически задеплоит изменения
4. ✅ Бот готов принимать сообщения через webhook

### Как проверить что всё работает:

1. **Подождите 2-3 минуты** пока Railway завершит деплой
   - Откройте: https://railway.app/dashboard
   - Проверьте что деплой завершен (зеленая галочка)

2. **Проверьте что endpoint работает:**
   ```
   https://descro-production.up.railway.app/api/telegram/webhook
   ```
   Должен вернуть: `{"status":"ok","message":"Telegram webhook is running"}`

3. **Настройте webhook** (выполните ОДИН РАЗ):
   
   Откройте в браузере эту ссылку:
   ```
   https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/setWebhook?url=https://descro-production.up.railway.app/api/telegram/webhook
   ```
   
   Должно вернуть:
   ```json
   {"ok":true,"result":true,"description":"Webhook was set"}
   ```

4. **Проверьте статус webhook:**
   
   Откройте в браузере:
   ```
   https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/getWebhookInfo
   ```
   
   Должно показать:
   ```json
   {
     "ok": true,
     "result": {
       "url": "https://descro-production.up.railway.app/api/telegram/webhook",
       "has_custom_certificate": false,
       "pending_update_count": 0
     }
   }
   ```

5. **Протестируйте бота:**
   - Откройте: https://t.me/Telegagocod_bot
   - Нажмите "Start" или отправьте `/start`
   - Должна появиться кнопка "🔐 Войти на сайт"
   - Нажмите на кнопку → вы войдете на сайт

## 🎯 Если webhook не устанавливается

### Вариант 1: Используйте VPN
1. Включите VPN
2. Откройте ссылку из шага 3 выше в браузере

### Вариант 2: Используйте онлайн-сервис
1. Откройте https://reqbin.com/
2. Выберите POST запрос
3. URL: `https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/setWebhook`
4. Body (JSON):
   ```json
   {
     "url": "https://descro-production.up.railway.app/api/telegram/webhook"
   }
   ```
5. Нажмите Send

### Вариант 3: Попросите кого-то за границей
Отправьте им эту ссылку для открытия в браузере:
```
https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/setWebhook?url=https://descro-production.up.railway.app/api/telegram/webhook
```

## 📊 Проверка логов

После настройки webhook проверьте логи на Railway:
1. Откройте Railway Dashboard
2. Перейдите в ваш проект
3. Откройте Deployments → View Logs
4. Отправьте `/start` боту
5. В логах должно появиться:
   ```
   📥 /start from user 123456 (username)
   ✅ Login link sent to user 123456
   ```

## ✅ Готово!

После настройки webhook вход через Telegram будет работать для всех пользователей.

## 🔄 Как это работает

1. Пользователь нажимает "Войти через Telegram" на сайте
2. Открывается бот @Telegagocod_bot
3. Пользователь отправляет `/start`
4. Telegram отправляет webhook запрос на ваш сервер
5. Сервер генерирует ссылку для входа с данными пользователя
6. Бот отправляет кнопку "Войти на сайт"
7. Пользователь нажимает → авторизуется на сайте
8. Создается аккаунт в Supabase с 3 бесплатными генерациями

## 🎉 Преимущества webhook

- ✅ Работает даже если Telegram заблокирован
- ✅ Не требует постоянно работающего процесса
- ✅ Быстрее чем polling
- ✅ Меньше нагрузка на сервер
- ✅ Официальный способ от Telegram
