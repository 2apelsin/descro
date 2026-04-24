# 🚀 БЫСТРОЕ ИСПРАВЛЕНИЕ TELEGRAM ВХОДА

## Проблема
Бот не работает, при нажатии /start ничего не происходит.

## Решение за 2 минуты

### 1. Установите webhook (выполните ОДНУ команду):

**Вариант А - через Node.js:**
```bash
cd telegram-bot
node setup-webhook.js set
```

**Вариант Б - через curl (если Node не работает):**
```bash
curl -X POST "https://api.telegram.org/bot8637559443:AAFYBo5VqNDYb2QW4k8XRDtuyOCtXZkoKSU/setWebhook" -H "Content-Type: application/json" -d "{\"url\":\"https://descro-production.up.railway.app/api/telegram/webhook\"}"
```

### 2. Проверьте что сработало:

```bash
curl https://descro-production.up.railway.app/api/telegram/webhook
```

Должно вернуть:
```json
{"status":"ok","message":"Telegram webhook is running"}
```

### 3. Протестируйте:

1. Откройте https://t.me/Telegagocod_bot
2. Нажмите Start
3. Должна появиться кнопка "🔐 Войти на сайт"
4. Нажмите → вы войдете на сайт

## ✅ Готово!

Теперь вход через Telegram работает.

## Что было исправлено?

- ❌ Было: Бот использовал polling (не работает в России)
- ✅ Стало: Бот использует webhook (работает везде)

## Если не работает

1. Проверьте что Railway деплой завершен
2. Выполните команду еще раз
3. Проверьте логи на Railway Dashboard

## Нужна помощь?

Напишите в Telegram: @your_support_username
