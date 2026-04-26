# Отладка webhook для возвратов

## Проблема
Сделал возврат в ЮKassa, но подписка не отменилась.

## Возможные причины

### 1. Webhook не настроен в ЮKassa
Проверь:
1. Зайди на https://yookassa.ru
2. "Настройки" → "Уведомления"
3. Должен быть URL: `https://descro-production.up.railway.app/api/payment/webhook`
4. Должны быть включены события:
   - payment.succeeded
   - payment.canceled
   - refund.succeeded

### 2. Таблица payments не создана
Проверь в Supabase:
1. Зайди в Table Editor
2. Должна быть таблица `payments`
3. Если нет - выполни SQL из файла `supabase-payments.sql`

### 3. ЮKassa не отправил уведомление
Проверь логи в Railway:
1. Зайди в Railway → Deployments → Logs
2. Найди строки с `[Webhook]`
3. Если нет - значит ЮKassa не отправил уведомление

## Быстрое решение - отмена вручную

### Вариант 1: Через командную строку
Запусти файл `cancel-subscription.bat` (уже создан с твоим email)

### Вариант 2: Через curl
```bash
curl -X POST https://descro-production.up.railway.app/api/admin/cancel-subscription \
  -H "Content-Type: application/json" \
  -d '{"email":"komkort778@gmail.com"}'
```

### Вариант 3: Через Supabase напрямую
1. Зайди в Supabase → Table Editor
2. Открой таблицу `users`
3. Найди свою запись по email
4. Установи `pro_until` в `NULL`
5. Сохрани

## Проверка работы webhook

После настройки webhook в ЮKassa:
1. Купи подписку снова (1₽)
2. Сделай возврат
3. Проверь логи Railway - должно быть:
   ```
   [Webhook] Event type: refund.succeeded
   [Webhook] Refund received for payment: xxx
   [Webhook] 💸 Возврат: PRO отменен для xxx
   ```

## Важно

Webhook работает только если:
1. ✅ URL настроен в ЮKassa
2. ✅ События включены (refund.succeeded)
3. ✅ Таблица payments создана в Supabase
4. ✅ ЮKassa отправляет уведомления (может быть задержка до 5 минут)

Если webhook не настроен - используй ручную отмену через `/api/admin/cancel-subscription`.
