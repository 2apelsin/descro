# 👋 Начни отсюда

## Что уже готово ✅

1. **Сайт полностью работает локально**
   - GigaChat генерирует описания
   - Лимит 3 генерации в день
   - Paywall после лимита
   - Все страницы для ЮKassa

2. **Код залит на GitHub**
   - Репозиторий: https://github.com/2apelsin/descro
   - Все файлы на месте

3. **Telegram бот создан**
   - @Telegagocod_bot
   - Токен настроен

4. **Supabase база настроена**
   - Таблица `teleg` создана
   - Все ключи есть

---

## Что нужно сделать сейчас 🚀

### 1. Деплой на Railway (5 минут)

**Читай:** `DEPLOY_NOW.md`

Коротко:
1. Зайти на https://railway.app
2. Подключить GitHub репозиторий `2apelsin/descro`
3. Добавить переменные окружения (скопировать из `DEPLOY_NOW.md`)
4. Дождаться сборки
5. Получить домен

### 2. Обновить Telegram бота (30 секунд)

После деплоя:
1. Открыть @BotFather
2. Отправить `/setdomain`
3. Выбрать `@Telegagocod_bot`
4. Указать домен Railway

### 3. Добавить реквизиты (2 минуты)

Открыть `app/requisites/page.tsx` и добавить:
- ИНН
- Telegram контакт

### 4. Создать оферту (10 минут)

1. Зайти на https://oferta-generator.ru
2. Сгенерировать оферту
3. Сохранить как `public/oferta.pdf`

### 5. Подать заявку в ЮKassa (когда всё готово)

После выполнения шагов 1-4 можно подавать заявку.

---

## Документация 📚

### Для деплоя
- **`DEPLOY_NOW.md`** — деплой за 5 минут ⭐
- `RAILWAY_DEPLOY.md` — подробная инструкция
- `FINAL_CHECKLIST.md` — полный чеклист

### Для настройки
- `GIGACHAT_SETUP.md` — как работает GigaChat
- `TELEGRAM_SETUP.md` — настройка бота
- `CREDENTIALS.md` — все ключи (не коммитить!)

### Для разработки
- `README.md` — общая информация
- `SETUP.md` — локальная разработка

---

## Структура проекта 📁

```
descro/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── generate/         # Генерация описаний (GigaChat)
│   │   ├── enhance/          # Улучшение характеристик
│   │   ├── auth/             # Telegram авторизация
│   │   └── generations/      # История генераций
│   ├── payment/              # Страницы оплаты
│   ├── requisites/           # Реквизиты
│   └── page.tsx              # Главная страница
│
├── components/               # React компоненты
│   ├── demo-form.tsx         # Форма генерации
│   ├── hero.tsx              # Hero секция
│   ├── pricing.tsx           # Тарифы
│   └── ...                   # Остальные компоненты
│
├── lib/                      # Утилиты
│   ├── auth.ts               # JWT авторизация
│   ├── auth-context.tsx      # React Context для auth
│   └── supabase.ts           # Supabase клиент
│
├── public/                   # Статика
│   └── oferta.pdf            # [нужно создать]
│
├── .env.local                # Переменные окружения
├── supabase-schema.sql       # SQL схема
└── package.json              # Зависимости
```

---

## Переменные окружения 🔐

Все переменные уже в `.env.local` и готовы для Railway.

Скопировать из `DEPLOY_NOW.md` в Railway Dashboard → Variables.

---

## Полезные ссылки 🔗

- Railway: https://railway.app
- Supabase: https://supabase.com/dashboard/project/zsmchferozuopiqhekyb
- GitHub: https://github.com/2apelsin/descro
- Telegram Bot: @Telegagocod_bot
- BotFather: @BotFather

---

## Помощь 🆘

### Проблемы с деплоем?
Читай `RAILWAY_DEPLOY.md` → раздел Troubleshooting

### GigaChat не работает?
Проверь что `NODE_TLS_REJECT_UNAUTHORIZED=0` добавлена в Railway

### Telegram бот не отвечает?
Обнови домен в @BotFather командой `/setdomain`

---

## Следующие шаги 🎯

1. ✅ Прочитай `DEPLOY_NOW.md`
2. ✅ Задеплой на Railway
3. ✅ Обнови бота
4. ✅ Добавь реквизиты
5. ✅ Создай оферту
6. ✅ Подай заявку в ЮKassa

**Время на всё: ~30 минут**

---

Удачи! 🚀

