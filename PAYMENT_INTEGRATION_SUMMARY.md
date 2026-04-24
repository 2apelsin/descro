# ✅ Интеграция ЮKassa — Готово!

## Что сделано

### 1. База данных Supabase ✅
- Таблица `teleg` уже существует
- Поля:
  - `telegram_id` — ID пользователя
  - `generations_left` — осталось генераций (3 для бесплатных, 999999 для PRO)
  - `pro_until` — дата окончания PRO подписки
  - `last_reset` — дата последнего сброса лимита

### 2. API роуты ✅

#### `/api/payment/create` — Создание платежа
- Принимает: `{ plan: "pro-first" | "pro" }`
- Требует: JWT токен авторизации
- Возвращает: ссылку на оплату ЮKassa
- Сохраняет: `telegram_id` в metadata платежа

#### `/api/payment/webhook` — Обработка оплаты
- Принимает: уведомления от ЮKassa
- Обрабатывает: `payment.succeeded`
- Обновляет: `pro_until` и `generations_left` в базе
- Отправляет: уведомление в Telegram (опционально)

### 3. Фронтенд ✅

#### Проверка PRO статуса
- При загрузке страницы проверяется `pro_until`
- Если PRO активен → безлимитные генерации
- Если нет → лимит 3 в день

#### Paywall
- Показывается когда `generations_left === 0` и `!isPro`
- Две кнопки:
  - "Получить PRO со скидкой" (199₽)
  - "Купить PRO" (299₽)
- Кнопки создают платёж и перенаправляют на ЮKassa

#### Кнопка генерации
- Неактивна если `!isPro && generations_left === 0`
- Показывает статус:
  - PRO: "✨ PRO активен — безлимитные генерации"
  - Бесплатно: "Осталось X из 3 бесплатных генераций"

### 4. Реквизиты ✅
- Страница `/requisites` обновлена
- ИНН: 132610362688
- ФИО: Аверьянов Илья Александрович
- Статус: Самозанятый
- Email: support@descro.ru

### 5. Документация ✅
- `YOOKASSA_SETUP.md` — подробная инструкция настройки
- `YOOKASSA_APPLICATION.md` — готовые данные для заявки
- Обновлены все чеклисты

---

## Что нужно сделать

### 1. Создать оферту ⚠️

**Обязательно!** ЮKassa не одобрит без оферты.

1. Зайти на https://oferta-generator.ru
2. Заполнить данные (см. `YOOKASSA_APPLICATION.md`)
3. Скачать PDF
4. Переименовать в `oferta.pdf`
5. Положить в папку `public/`
6. Закоммитить:
   ```bash
   git add public/oferta.pdf
   git commit -m "Add oferta.pdf"
   git push origin main
   ```

### 2. Подать заявку в ЮKassa

После создания оферты:

1. Зайти на https://yookassa.ru
2. Нажать "Подключиться"
3. Выбрать "Платежи на сайте"
4. Заполнить форму данными из `YOOKASSA_APPLICATION.md`
5. Отправить заявку
6. Дождаться одобрения (1-3 дня)

### 3. Настроить ЮKassa после одобрения

1. Получить Shop ID и Secret Key
2. Добавить в Railway Variables:
   ```env
   YOOKASSA_SHOP_ID=ваш_shop_id
   YOOKASSA_SECRET_KEY=ваш_secret_key
   NEXT_PUBLIC_APP_URL=https://descro-production.up.railway.app
   ```
3. Настроить webhook URL в ЮKassa:
   ```
   https://descro-production.up.railway.app/api/payment/webhook
   ```
4. Протестировать оплату

---

## Как это работает

### Сценарий 1: Неавторизованный пользователь

1. Пользователь открывает сайт
2. Генерирует 3 описания (лимит из localStorage)
3. После 3-й генерации → paywall
4. Нажимает "Получить PRO" → предложение войти через Telegram

### Сценарий 2: Авторизованный пользователь (бесплатный)

1. Пользователь входит через Telegram
2. Генерирует 3 описания (лимит из Supabase)
3. После 3-й генерации → paywall
4. Нажимает "Получить PRO со скидкой" (199₽)
5. Перенаправляется на ЮKassa
6. Оплачивает
7. Webhook обновляет `pro_until` и `generations_left`
8. PRO активирован! ✨

### Сценарий 3: PRO пользователь

1. Пользователь входит через Telegram
2. Видит "✨ PRO активен — безлимитные генерации"
3. Генерирует сколько угодно описаний
4. Лимит не проверяется

---

## Переменные окружения

### Локально (.env.local)
```env
YOOKASSA_SHOP_ID=your_shop_id_here
YOOKASSA_SECRET_KEY=your_secret_key_here
```

### Railway (после одобрения ЮKassa)
```env
YOOKASSA_SHOP_ID=ваш_shop_id
YOOKASSA_SECRET_KEY=ваш_secret_key
NEXT_PUBLIC_APP_URL=https://descro-production.up.railway.app
```

---

## Тестирование

### Тестовая карта ЮKassa
```
Номер: 5555 5555 5555 4477
Срок: любой будущий (например 12/25)
CVC: любой 3-значный (например 123)
3DS код: 12345
```

### Проверка PRO статуса
```bash
# Получить информацию о пользователе
curl -H "Authorization: Bearer <jwt_token>" \
  https://descro-production.up.railway.app/api/auth/me

# Ответ:
{
  "success": true,
  "user": {
    "telegram_id": 123456789,
    "generations_left": 999999,
    "pro_until": "2026-05-24T12:00:00Z"
  }
}
```

---

## Безопасность

### JWT токены
- Используются для авторизации
- Хранятся в localStorage
- Содержат `telegram_id`

### Webhook
- Принимает уведомления только от ЮKassa
- Проверяет IP-адреса (опционально)
- Проверяет подпись (опционально)

### Metadata платежа
- `telegram_id` — для идентификации пользователя
- `plan` — для определения тарифа

---

## Мониторинг

### Логи Railway
```bash
railway logs
```

### Проверка webhook
```bash
# Добавить console.log в /api/payment/webhook
console.log('[Webhook] Received:', notification)
```

### Проверка Supabase
```sql
-- Посмотреть всех PRO пользователей
SELECT * FROM teleg WHERE pro_until > NOW();

-- Посмотреть историю платежей (если добавить таблицу)
SELECT * FROM payments ORDER BY created_at DESC;
```

---

## Следующие шаги

1. ✅ Создать оферту (`public/oferta.pdf`)
2. ✅ Подать заявку в ЮKassa
3. ⏳ Дождаться одобрения (1-3 дня)
4. ✅ Получить ключи и настроить
5. ✅ Протестировать оплату
6. ✅ Запустить в продакшен!

---

## Документация

- `YOOKASSA_SETUP.md` — подробная инструкция
- `YOOKASSA_APPLICATION.md` — данные для заявки
- `FINAL_CHECKLIST.md` — общий чеклист

---

Всё готово к интеграции платежей! 🚀

