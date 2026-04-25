# 🔧 Исправление ошибки "non ISO-8859-1 code point"

## Проблема

Ошибка: `Failed to execute 'fetch' on 'Window': Failed to read the 'headers' property from 'RequestInit': String contains non ISO-8859-1 code point`

Это означает, что в HTTP заголовках передаётся кириллица или другие не-ASCII символы.

## Где искать

HTTP заголовки могут содержать только ASCII символы (ISO-8859-1). Кириллица запрещена.

### Возможные места:

1. **Authorization header** - если токен содержит кириллицу
2. **Content-Type** - обычно OK
3. **Custom headers** - если передаёте русский текст
4. **Error messages** - если ошибка попадает в заголовок

## Решение

### Вариант 1: Проверьте токен

Если используете JWT токен, убедитесь что он в base64 (только ASCII).

### Вариант 2: Кодируйте кириллицу

Если нужно передать русский текст в заголовке:

```javascript
// ❌ Неправильно
headers: {
  'X-Message': 'Привет'
}

// ✅ Правильно
headers: {
  'X-Message': encodeURIComponent('Привет')
}
```

### Вариант 3: Передавайте в body

Вместо заголовков используйте тело запроса:

```javascript
// ❌ Неправильно
fetch('/api/endpoint', {
  headers: {
    'X-Description': 'PRO доступ на 1 месяц'
  }
})

// ✅ Правильно
fetch('/api/endpoint', {
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    description: 'PRO доступ на 1 месяц'
  })
})
```

## Проверка кода

Проверьте все места где используется `fetch()`:

```bash
# Поиск всех fetch вызовов
grep -r "fetch(" app/ components/
```

Убедитесь что в `headers` нет кириллицы.

## Текущий код

В вашем коде `/api/payment/create` всё правильно - кириллица только в `body`, не в `headers`.

Проблема может быть в:
- Старом коде который ещё не обновлён
- Другом API endpoint
- Клиентском коде который вызывает API

## Быстрое решение

Если не можете найти где ошибка, добавьте обработку:

```javascript
try {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Убедитесь что все значения - ASCII
      'Authorization': `Bearer ${token}` // token должен быть ASCII
    },
    body: JSON.stringify(data) // Кириллица OK в body
  })
} catch (error) {
  console.error('Fetch error:', error)
  // Проверьте что именно передаётся в headers
}
```

## Проверка

1. Откройте DevTools (F12)
2. Network tab
3. Найдите failed запрос
4. Посмотрите Request Headers
5. Найдите заголовок с кириллицей

---

**Скорее всего проблема в старом коде, который не использует новую систему авторизации.**
