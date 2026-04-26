# 🚀 SEO Гайд для Descro

## ✅ Что уже сделано

### 1. Технический SEO
- ✅ robots.txt создан
- ✅ sitemap.xml автоматически генерируется
- ✅ Meta-теги оптимизированы
- ✅ Open Graph для соцсетей
- ✅ Structured Data (JSON-LD)
- ✅ Мобильная адаптация
- ✅ Быстрая загрузка (Next.js)
- ✅ HTTPS (Railway)
- ✅ Яндекс.Метрика установлена

### 2. Контент
- ✅ Уникальные заголовки H1-H3
- ✅ SEO-friendly URL
- ✅ Alt-теги для изображений (нужно добавить)
- ✅ Внутренние ссылки
- ✅ Ключевые слова в контенте

## 📋 Что нужно сделать СЕЙЧАС

### Шаг 1: Регистрация в поисковиках (5 минут)

#### Google Search Console
1. Открой https://search.google.com/search-console
2. Добавь сайт: `https://descro-production.up.railway.app`
3. Подтверди владение (HTML-тег или файл)
4. Отправь sitemap: `https://descro-production.up.railway.app/sitemap.xml`

**Код для подтверждения:**
```html
<!-- Добавь в app/layout.tsx в <head> -->
<meta name="google-site-verification" content="ВАШ_КОД" />
```

#### Яндекс Вебмастер
1. Открой https://webmaster.yandex.ru
2. Добавь сайт: `https://descro-production.up.railway.app`
3. Подтверди владение (meta-тег)
4. Отправь sitemap: `https://descro-production.up.railway.app/sitemap.xml`

**Код для подтверждения:**
```html
<!-- Добавь в app/layout.tsx в <head> -->
<meta name="yandex-verification" content="ВАШ_КОД" />
```

### Шаг 2: Создать og-image.png (10 минут)

Создай изображение 1200x630px с:
- Логотип Descro
- Текст: "Описания товаров за 10 секунд"
- Подзаголовок: "AI-генератор для Ozon, Wildberries, Яндекс Маркет"

Сохрани как `public/og-image.png`

**Инструменты:**
- Canva: https://canva.com
- Figma: https://figma.com
- OG Image Generator: https://og-image.vercel.app

### Шаг 3: Добавить иконки (5 минут)

Создай и добавь в `public/`:
- `icon.svg` - векторная иконка
- `icon-light-32x32.png` - для светлой темы
- `icon-dark-32x32.png` - для тёмной темы
- `apple-icon.png` - 180x180px для iOS

### Шаг 4: Настроить домен (опционально)

Вместо `descro-production.up.railway.app` купи домен:
- descro.ru (Reg.ru, Timeweb)
- descro.com (Namecheap, GoDaddy)

**После покупки:**
1. В Railway → Settings → Domains → Add Custom Domain
2. Добавь DNS записи у регистратора
3. Обнови все URL в коде на новый домен

## 🎯 Ключевые слова для продвижения

### Основные (высокая конкуренция)
- генератор описаний товаров
- описания для ozon
- описания для wildberries
- ai генератор текстов

### Длинные (низкая конкуренция, высокая конверсия)
- как написать описание товара для ozon
- автоматический генератор описаний для маркетплейсов
- нейросеть для создания описаний товаров
- сервис для генерации карточек товаров
- ai для описаний wildberries

### Локальные
- генератор описаний товаров россия
- сервис для селлеров ozon
- инструмент для продавцов wildberries

## 📊 Мониторинг и аналитика

### Яндекс.Метрика (уже установлена)
- ID: 108773114
- Отслеживает: клики, конверсии, поведение

### Google Analytics (рекомендуется добавить)
```bash
npm install @next/third-parties
```

```tsx
// В app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

## 🔗 Внешние ссылки (Backlinks)

### Где разместить ссылки на Descro:

1. **Форумы и сообщества:**
   - https://forum.ozon.ru
   - https://forum.wildberries.ru
   - https://vc.ru (статья про инструменты для селлеров)
   - https://habr.com (техническая статья)

2. **Каталоги сервисов:**
   - https://startpack.ru
   - https://aitoolslist.ru
   - https://producthunt.com

3. **Соцсети:**
   - Telegram каналы про маркетплейсы
   - VK группы селлеров
   - YouTube обзоры инструментов

4. **Партнёрства:**
   - Блогеры про маркетплейсы
   - Курсы для селлеров
   - Агентства по продвижению на маркетплейсах

## 📝 Контент-план для блога (опционально)

Создай раздел `/blog` со статьями:

1. "Как написать продающее описание товара для Ozon"
2. "10 ошибок в карточках товаров на Wildberries"
3. "SEO для маркетплейсов: полное руководство"
4. "Как AI помогает продавцам экономить время"
5. "Сравнение генераторов описаний товаров"

## ⚡ Быстрые победы (сделай сегодня)

1. ✅ Зарегистрируйся в Google Search Console
2. ✅ Зарегистрируйся в Яндекс Вебмастер
3. ✅ Отправь sitemap в оба сервиса
4. ✅ Создай og-image.png
5. ✅ Добавь иконки сайта
6. ⏳ Напиши пост в VC.ru про Descro
7. ⏳ Разместись в каталоге startpack.ru

## 📈 Ожидаемые результаты

### Через 1 неделю:
- Сайт проиндексирован Google и Яндекс
- Появление в поиске по брендовым запросам ("descro")

### Через 1 месяц:
- 50-100 посетителей в день из поиска
- Позиции по длинным запросам (топ 10-30)

### Через 3 месяца:
- 200-500 посетителей в день
- Позиции по основным запросам (топ 5-20)
- Органические регистрации

## 🛠 Инструменты для проверки SEO

1. **Google PageSpeed Insights**
   https://pagespeed.web.dev
   Проверь скорость загрузки

2. **Яндекс Вебмастер**
   https://webmaster.yandex.ru
   Проверь индексацию

3. **Serpstat / Ahrefs**
   Анализ конкурентов и ключевых слов

4. **Schema Markup Validator**
   https://validator.schema.org
   Проверь structured data

## 📞 Поддержка

Если нужна помощь с SEO:
- Email: descrosupport@gmail.com
- Яндекс.Метрика: https://metrika.yandex.ru/dashboard?id=108773114

---

**Следующий шаг:** Зарегистрируйся в Google Search Console и Яндекс Вебмастер прямо сейчас! 🚀
