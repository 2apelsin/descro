# GigaChat SSL Certificate Issue

## Проблема

GigaChat API от Сбера использует самоподписанный или нестандартный SSL сертификат, что вызывает ошибку:
```
Не удалось установить доверительные отношения для защищенного канала SSL/TLS
```

## Текущее решение (НЕ БЕЗОПАСНО)

В `.env.local` установлена переменная:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Это отключает проверку SSL сертификатов для ВСЕХ запросов в приложении, что создает уязвимость к MITM атакам.

## Безопасное решение

### Вариант 1: Использовать custom HTTPS agent (РЕКОМЕНДУЕТСЯ)

Создать отдельный agent только для GigaChat запросов:

```typescript
import https from 'https'

// Custom agent только для GigaChat
const gigachatAgent = new https.Agent({
  rejectUnauthorized: false, // Только для GigaChat!
})

// В fetch запросах к GigaChat
const res = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
  method: 'POST',
  headers: { ... },
  body: '...',
  // @ts-ignore - Node.js specific
  agent: gigachatAgent
})
```

### Вариант 2: Добавить сертификат Сбера в trusted store

1. Скачать сертификат:
```bash
openssl s_client -showcerts -connect ngw.devices.sberbank.ru:9443 < /dev/null 2>&1 | openssl x509 -outform PEM > sberbank.crt
```

2. Использовать в коде:
```typescript
import fs from 'fs'
import https from 'https'

const cert = fs.readFileSync('./sberbank.crt')
const agent = new https.Agent({
  ca: cert
})
```

### Вариант 3: Использовать прокси с валидным сертификатом

Создать промежуточный сервис с валидным SSL, который проксирует запросы к GigaChat.

## Что сделать СЕЙЧАС

1. Реализовать Вариант 1 (custom agent)
2. Убрать `NODE_TLS_REJECT_UNAUTHORIZED=0` из `.env.local`
3. Убрать из Railway environment variables
4. Протестировать работу GigaChat API

## Файлы для изменения

- `app/api/generate/route.ts` - добавить custom agent
- `.env.local` - удалить NODE_TLS_REJECT_UNAUTHORIZED
- Railway dashboard - удалить переменную

## Риски

- Если убрать NODE_TLS_REJECT_UNAUTHORIZED без custom agent - GigaChat перестанет работать
- Custom agent работает только в Node.js runtime (не в Edge runtime)
- Нужно убедиться что `export const runtime = 'nodejs'` установлен в route.ts

## Статус

🔴 В РАБОТЕ - требует тестирования после внедрения custom agent
