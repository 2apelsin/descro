# ✅ Финальный чеклист перед запуском

## 1. Реквизиты

- [x] ФИО: Аверьянов Илья Александрович
- [ ] ИНН: [нужно добавить в `app/requisites/page.tsx`]
- [ ] Telegram: [нужно добавить в `app/requisites/page.tsx`]
- [ ] Email: support@descro.ru (уже есть)

## 2. Документы

- [ ] Создать оферту на https://oferta-generator.ru
- [ ] Положить в `public/oferta.pdf`

## 3. Деплой на Railway

- [ ] Создать проект на https://railway.app
- [ ] Подключить GitHub репозиторий `2apelsin/descro`
- [ ] Добавить переменные окружения (см. `RAILWAY_DEPLOY.md`)
- [ ] Дождаться автоматической пересборки
- [ ] Получить домен Railway (например: `descro-production.up.railway.app`)
- [ ] Проверить что сайт работает
- [ ] Проверить что GigaChat генерирует описания

## 4. Telegram бот

- [ ] После деплоя на Railway обновить домен в @BotFather
- [ ] Отправить `/setdomain` боту @BotFather
- [ ] Выбрать `@Telegagocod_bot`
- [ ] Указать домен Railway (без https://)

## 5. ЮKassa

После деплоя можно подавать заявку:
- ✅ Главная с тарифами
- ✅ Страница `/requisites`
- [ ] Файл `/oferta.pdf`
- ✅ Страницы `/payment/success` и `/payment/cancel`

## 6. Что работает сейчас

- ✅ GigaChat генерирует описания
- ✅ Лимит 3 генерации в день
- ✅ Paywall после 3 генераций
- ✅ Все страницы для ЮKassa
- ✅ Оптимизированные промпты для маркетплейсов

## 7. Что нужно доделать

1. **Добавить ИНН** в `app/requisites/page.tsx`
2. **Создать оферту** и положить в `public/oferta.pdf`
3. **Задеплоить на Railway/VPS** (не Vercel!)
4. **Обновить домен бота** в @BotFather
5. **Подать заявку в ЮKassa**

## Инструкции

- **Деплой на Railway**: `RAILWAY_DEPLOY.md` ⭐
- Telegram: `TELEGRAM_SETUP.md`
- GigaChat: `GIGACHAT_SETUP.md`
- ~~Vercel (не работает)~~: `VERCEL_DEPLOY.md`
