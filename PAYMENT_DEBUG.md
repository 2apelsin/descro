# Отладка платежей - что делать

## Проблема
При нажатии "Оформить PRO" возникает ошибка 500.

## Что я сделал
1. Добавил подробное логирование в `/api/payment/create`
2. Улучшил обработку ошибок на фронтенде

## Что нужно сделать СЕЙЧАС

### Шаг 1: Задеплой изменения
```bash
git add .
git commit -m "Add payment debugging"
git push
```

### Шаг 2: Проверь переменные окружения в Railway
Зайди в Railway → Variables и убедись что есть:
- `YOOKASSA_SHOP_ID` = `1338860`
- `YOOKASSA_SECRET_KEY` = `live_2db7V3OuhRasAnUUwD7pGICDavrp-exydLhF8-GPfRc`

Если их нет - ДОБАВЬ!

### Шаг 3: Перезапусти приложение в Railway
После добавления переменных нажми "Restart" в Railway

### Шаг 4: Попробуй купить подписку
1. Зайди на https://descro-production.up.railway.app/pricing
2. Войди в аккаунт
3. Нажми "Оформить PRO"
4. Смотри что покажет alert с ошибкой

### Шаг 5: Проверь логи Railway
Открой логи в Railway и найди строки с `[Payment]`:
- `[Payment] Credentials check:` - покажет есть ли ключи
- `[Payment] Creating payment for user:` - попытка создания
- `[Payment] YooKassa error:` - ошибка от ЮKassa (если есть)

## Возможные проблемы

### 1. Нет переменных окружения
Если в логах видишь:
```
[Payment] Credentials check: { hasShopId: false, hasSecretKey: false }
```
Значит нужно добавить переменные в Railway (см. Шаг 2)

### 2. Неверные ключи ЮKassa
Если видишь ошибку от ЮKassa типа "invalid_credentials" или "unauthorized":
- Проверь что YOOKASSA_SHOP_ID правильный
- Проверь что YOOKASSA_SECRET_KEY правильный (live_ ключ)
- Убедись что магазин активирован в личном кабинете ЮKassa

### 3. Магазин не активирован
Если ЮKassa возвращает ошибку про неактивный магазин:
- Зайди на https://yookassa.ru
- Проверь статус магазина
- Возможно нужно пройти модерацию или подписать договор

## Что дальше
После того как увидишь конкретную ошибку в логах или в alert - напиши мне что там, и я помогу исправить.
