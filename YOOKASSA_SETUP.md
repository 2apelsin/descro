# 💳 Настройка ЮKassa

## Шаг 1: Регистрация в ЮKassa

1. Зайти на https://yookassa.ru
2. Нажать "Подключиться"
3. Заполнить данные:
   - ФИО: Аверьянов Илья Александрович
   - ИНН: [твой ИНН]
   - Статус: Самозанятый
   - Email: support@descro.ru
   - Сайт: https://descro-production.up.railway.app

4. Указать страницы:
   - Реквизиты: `/requisites`
   - Оферта: `/oferta.pdf`
   - Success URL: `/payment/success`
   - Cancel URL: `/payment/cancel`

5. Дождаться одобрения (1-3 дня)

---

## Шаг 2: Получить ключи

После одобрения:

1. Зайти в личный кабинет ЮKassa
2. Перейти в "Настройки" → "Интеграция"
3. Скопировать:
   - **Shop ID** (идентификатор магазина)
   - **Secret Key** (секретный ключ)

---

## Шаг 3: Добавить ключи в Railway

1. Открыть Railway Dashboard
2. Перейти в Variables
3. Добавить:

```env
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
NEXT_PUBLIC_APP_URL=https://descro-production.up.railway.app
```

4. Railway автоматически пересоберет проект

---

## Шаг 4: Настроить Webhook

1. В личном кабинете ЮKassa → "Настройки" → "Уведомления"
2. Указать URL webhook:
   ```
   https://descro-production.up.railway.app/api/payment/webhook
   ```
3. Выбрать события:
   - ✅ `payment.succeeded` (успешная оплата)
   - ✅ `payment.canceled` (отмена оплаты)
4. Сохранить

---

## Шаг 5: Тестирование

### Локально (тестовый режим):

1. ЮKassa предоставляет тестовые ключи
2. Используй тестовую карту: `5555 5555 5555 4477`
3. Срок: любой будущий
4. CVC: любой 3-значный
5. 3DS: код `12345`

### На продакшене:

1. Войти через Telegram на сайте
2. Попробовать сгенерировать 3 описания
3. После 3-й генерации появится paywall
4. Нажать "Получить PRO со скидкой"
5. Оплатить тестовой картой
6. Проверить что PRO активировался

---

## Как это работает

### 1. Создание платежа

Когда пользователь нажимает "Получить PRO":

```typescript
POST /api/payment/create
Authorization: Bearer <telegram_jwt_token>
Body: { plan: "pro-first" }

Response: {
  success: true,
  paymentUrl: "https://yoomoney.ru/checkout/...",
  paymentId: "2d8e8e8e-..."
}
```

Пользователь перенаправляется на `paymentUrl` для оплаты.

### 2. Обработка успешной оплаты

После оплаты ЮKassa отправляет webhook:

```typescript
POST /api/payment/webhook
Body: {
  event: "payment.succeeded",
  object: {
    id: "2d8e8e8e-...",
    metadata: {
      telegram_id: "123456789",
      plan: "pro-first"
    }
  }
}
```

Webhook:
1. Находит пользователя по `telegram_id`
2. Устанавливает `pro_until` = сейчас + 30 дней
3. Устанавливает `generations_left` = 999999 (безлимит)
4. Отправляет уведомление в Telegram (опционально)

### 3. Проверка PRO статуса

При каждой генерации:

```typescript
GET /api/auth/me
Authorization: Bearer <telegram_jwt_token>

Response: {
  success: true,
  user: {
    telegram_id: 123456789,
    generations_left: 999999,
    pro_until: "2026-05-24T12:00:00Z"
  }
}
```

Если `pro_until > now()` → пользователь PRO, лимит не проверяется.

---

## Тарифы

### PRO (первый месяц)
- Цена: 199₽
- Скидка: 33%
- План: `pro-first`

### PRO (обычная цена)
- Цена: 299₽
- План: `pro`

---

## Безопасность

### IP-адреса ЮKassa

Webhook приходит только с этих IP:
- `185.71.76.0/27`
- `185.71.77.0/27`
- `77.75.153.0/25`
- `77.75.156.11`
- `77.75.156.35`
- `2a02:5180::/32`

Можно добавить проверку IP в webhook (опционально).

### Проверка подписи

ЮKassa подписывает каждый webhook. Можно добавить проверку подписи для дополнительной безопасности.

---

## Troubleshooting

### Webhook не приходит
- Проверь URL webhook в настройках ЮKassa
- Проверь что домен доступен извне
- Проверь логи Railway: `railway logs`

### Платёж не создаётся
- Проверь что `YOOKASSA_SHOP_ID` и `YOOKASSA_SECRET_KEY` правильные
- Проверь что пользователь авторизован (есть JWT токен)
- Проверь логи: `railway logs`

### PRO не активируется
- Проверь что webhook приходит: добавь `console.log` в `/api/payment/webhook`
- Проверь что `telegram_id` правильный
- Проверь Supabase: есть ли запись с этим `telegram_id`

---

## Полезные ссылки

- Документация ЮKassa: https://yookassa.ru/developers
- API Reference: https://yookassa.ru/developers/api
- Тестовые карты: https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing

---

## Следующие шаги

После настройки ЮKassa:

1. ✅ Протестировать оплату
2. ✅ Проверить что PRO активируется
3. ✅ Проверить что безлимит работает
4. ✅ Добавить аналитику (опционально)
5. ✅ Настроить email-уведомления (опционально)

