# ✅ Обработка возвратов настроена

## Что добавлено

### 1. Таблица payments
Создана новая таблица для хранения истории платежей:
- `user_id` - ID пользователя
- `payment_id` - ID платежа из ЮKassa
- `amount` - сумма платежа
- `status` - статус (pending, succeeded, canceled, refunded)
- `created_at`, `updated_at` - даты

### 2. Webhook обрабатывает 3 события:

**payment.succeeded** - успешная оплата
- Обновляет статус платежа на "succeeded"
- Активирует PRO на 30 дней

**payment.canceled** - отмена платежа
- Обновляет статус на "canceled"
- Обнуляет `pro_until` (отменяет подписку)

**refund.succeeded** - возврат средств
- Находит платеж по `payment_id`
- Обновляет статус на "refunded"
- Обнуляет `pro_until` (отменяет подписку)

### 3. Сохранение платежей
При создании платежа теперь сохраняется запись в таблицу `payments` со статусом "pending".

## Настройка

### Шаг 1: Создай таблицу в Supabase

Зайди в Supabase SQL Editor и выполни:

```sql
-- Скопируй содержимое файла supabase-payments.sql
```

Или просто выполни команды из файла `supabase-payments.sql`.

### Шаг 2: Настрой webhook в ЮKassa

1. Зайди на https://yookassa.ru
2. Перейди в "Настройки" → "Уведомления"
3. Добавь URL webhook:
   ```
   https://descro-production.up.railway.app/api/payment/webhook
   ```
4. Выбери события:
   - ✅ payment.succeeded
   - ✅ payment.canceled
   - ✅ refund.succeeded

### Шаг 3: Проверь работу

**Тест возврата:**
1. Купи подписку (1₽ для теста)
2. Проверь что PRO активирован
3. Зайди в ЮKassa → Платежи
4. Найди платеж и сделай возврат
5. Проверь что подписка отменилась

## Как это работает

1. **Пользователь оплачивает** → создается запись в `payments` (status: pending)
2. **ЮKassa подтверждает** → webhook получает `payment.succeeded` → статус меняется на "succeeded", активируется PRO
3. **Делается возврат** → webhook получает `refund.succeeded` → статус меняется на "refunded", PRO отменяется
4. **Платеж отменен** → webhook получает `payment.canceled` → статус меняется на "canceled", PRO отменяется

## Логи

В Railway смотри логи с префиксом `[Webhook]`:
- `✅ PRO активирован` - успешная оплата
- `💸 Возврат: PRO отменен` - возврат средств
- `❌ Отмена: PRO отменен` - отмена платежа

## Важно

После создания таблицы `payments` в Supabase, все будет работать автоматически. Webhook уже настроен и задеплоен.
