# Настройка GigaChat API

## Шаг 1: Получение Authorization key

1. Перейдите на https://developers.sber.ru/studio/workspaces
2. Войдите или зарегистрируйтесь
3. Перейдите в раздел "Мой GigaChat API"
4. Скопируйте **Client ID**: `019dbb35-9281-71cd-9574-3d2b1de4ccfa`
5. В разделе "Ключ авторизации" нажмите кнопку **"Получить ключ"**
6. Скопируйте полученный **Authorization key** (это длинная строка Base64)

## Шаг 2: Настройка .env.local

Откройте файл `.env.local` и обновите:

```env
GIGACHAT_CLIENT_ID=019dbb35-9281-71cd-9574-3d2b1de4ccfa
GIGACHAT_CLIENT_SECRET=ваш_authorization_key_сюда
```

**ВАЖНО:** 
- `GIGACHAT_CLIENT_SECRET` - это НЕ "GIGACHAT_API_PERS", а полученный Authorization key!
- Authorization key - это длинная строка Base64, которую вы получаете после нажатия кнопки "Получить ключ"

## Шаг 3: Перезапуск сервера

Остановите текущий сервер (Ctrl+C) и запустите заново:

```bash
npm run dev
```

Или через bat файл:
```bash
start-dev.bat
```

## Как это работает

1. **Получение токена**: При первом запросе система использует Authorization key для получения OAuth2 access token
2. **Кэширование**: Access token кэшируется до истечения срока действия (30 минут)
3. **Генерация**: Запрос отправляется к GigaChat-Max (или GigaChat-Pro как fallback)
4. **Fallback**: Если GigaChat недоступен, используется улучшенная mock-генерация

## Пример запроса к GigaChat

```bash
# 1. Получаем access token
curl -X POST https://ngw.devices.sberbank.ru:9443/api/v2/oauth \
  -H "Authorization: Basic YOUR_AUTHORIZATION_KEY" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "RqUID: $(uuidgen)" \
  -d "scope=GIGACHAT_API_PERS"

# 2. Используем access token для генерации
curl -X POST https://gigachat.devices.sberbank.ru/api/v1/chat/completions \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "GigaChat-Max",
    "messages": [
      {"role": "system", "content": "Ты копирайтер для маркетплейсов"},
      {"role": "user", "content": "Создай описание товара..."}
    ]
  }'
```

## Troubleshooting

### Ошибка "GigaChat credentials not configured"
- Проверьте, что переменные окружения установлены в `.env.local`
- Перезапустите dev сервер

### Ошибка "Token request failed: 401"
- Authorization key неправильный или истек
- Получите новый ключ на https://developers.sber.ru/studio/workspaces

### Ошибка "GigaChat API error: 400"
- Модель GigaChat-Max может быть недоступна
- Система автоматически переключится на GigaChat-Pro

### Используется mock-генерация
- Это нормально, если GigaChat временно недоступен или credentials не настроены
- Mock-генерация создает качественные описания на основе введенных данных
- Проверьте логи в консоли для деталей


## Как это работает

1. **Получение токена**: При первом запросе система получает OAuth2 токен от GigaChat
2. **Кэширование**: Токен кэшируется до истечения срока действия
3. **Генерация**: Запрос отправляется к GigaChat-Max (или GigaChat-Pro как fallback)
4. **Fallback**: Если GigaChat недоступен, используется mock-генерация

## Лимиты

- **Бесплатно**: 3 генерации в день (сбрасывается каждые 24 часа)
- **Pro**: Безлимит за 299₽/мес

## Troubleshooting

### Ошибка "GigaChat credentials not configured"
- Проверьте, что переменные окружения установлены в `.env.local`
- Перезапустите dev сервер

### Ошибка "Token request failed"
- Проверьте правильность Client ID и Client Secret
- Убедитесь, что у вас есть доступ к GigaChat API

### Ошибка "GigaChat API error: 400"
- Модель GigaChat-Max может быть недоступна
- Система автоматически переключится на GigaChat-Pro

### Используется mock-генерация
- Это нормально, если GigaChat временно недоступен
- Проверьте логи в консоли для деталей
