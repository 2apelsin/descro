# 🔒 БЕЗОПАСНОСТЬ

## ⚠️ ВАЖНО: Секретные ключи

**НИКОГДА не коммитьте реальные ключи в git!**

### Где хранятся секреты:

1. **Локально:** `.env.local` (добавлен в .gitignore)
2. **Production:** Railway Environment Variables
3. **Документация:** `CREDENTIALS.md` (добавлен в .gitignore)

### Что делать если ключ попал в git:

```bash
# 1. Немедленно сменить ключ в сервисе (GigaChat/ЮKassa)
# 2. Удалить из git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch CREDENTIALS.md" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (ОСТОРОЖНО!)
git push origin --force --all
```

### Проверка перед коммитом:

```bash
# Поиск потенциальных секретов
grep -r "GIGACHAT_CLIENT_SECRET" .
grep -r "YOOKASSA_SECRET_KEY" .
grep -r "live_" .
grep -r "Bearer " .
```

### Безопасные примеры в документации:

✅ **Правильно:**
```env
GIGACHAT_CLIENT_ID=your_client_id_here
GIGACHAT_CLIENT_SECRET=your_client_secret_here
YOOKASSA_SECRET_KEY=your_secret_key_here
```

❌ **Неправильно:**
```env
GIGACHAT_CLIENT_ID=019dbb35-9281-71cd-9574-3d2b1de4ccfa
YOOKASSA_SECRET_KEY=live_2db7V3OuhRasAnUUwD7pGICDavrp-exydLhF8-GPfRc
```

---

## 🛡️ Другие меры безопасности

### 1. Environment Variables

Все секреты должны быть в переменных окружения:
- `.env.local` - для локальной разработки
- Railway Variables - для production

### 2. JWT Secret

```env
JWT_SECRET=используйте_длинную_случайную_строку_минимум_32_символа
```

Сгенерировать:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Supabase Keys

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - можно в коде (публичный)
- `SUPABASE_SERVICE_ROLE_KEY` - ТОЛЬКО в env variables (секретный)

### 4. Rate Limiting

Уже реализовано:
- 3 платежа в минуту на пользователя
- Защита от повторных платежей

### 5. SQL Injection

Защищено через Supabase prepared statements.

### 6. XSS

Защищено через React (автоматический escaping).

---

## 📋 Чек-лист безопасности

- [x] `.env.local` в .gitignore
- [x] `CREDENTIALS.md` в .gitignore
- [x] Реальные ключи заменены на placeholders в документации
- [x] JWT токены с секретом
- [x] Bcrypt для паролей
- [x] Rate limiting для платежей
- [ ] httpOnly cookies для JWT (TODO)
- [ ] Email верификация (TODO)
- [ ] 2FA (TODO)

---

## 🚨 Что делать при утечке

1. **Немедленно** сменить скомпрометированный ключ
2. Проверить логи на подозрительную активность
3. Уведомить пользователей (если затронуты их данные)
4. Удалить ключ из git history
5. Обновить документацию

---

## 📞 Контакты

При обнаружении уязвимости: descrosupport@gmail.com
