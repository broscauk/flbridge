# FL Bridge — product page

**English** · [Русский](#русский)

Static product page for **FL Bridge**, a VST3 host that runs FL Studio's native plugins inside any
DAW. Built for GitHub Pages: no build step, no framework — `index.html`, one stylesheet, three
scripts.

## What is on the page

- Hero, feature grid, gallery with lightbox, FAQ, download / buy / donate blocks, contacts.
- **Interactive demo** (`demo.js`) — a working mock-up of the real 1.0 frame: module search
  (`Ctrl+F`), macro knobs with touch-learn and the Matrix, A/B, presets, settings (scale, accent,
  macro position), the MODULES panel with downloads and *install all missing*, About.
- **Guided tour and hints** (`tour.js`) — every control of the frame has a hover hint in the page
  language; an 18-step tour drives the demo (opens the palette, loads a module, links a macro,
  recolours the frame…) and explains each control. Feature cards link to the matching step.
- **Live module catalogue** — read from `manifest.json` in
  [flbridge-modules](https://github.com/broscauk/flbridge-modules) (jsDelivr first, then raw
  GitHub). `modules-data.js` is an offline snapshot so the table never comes up empty.
- **Two languages**, English primary. Picked from `?lang=en|ru`, then `localStorage`, then
  `navigator.language`. All strings live in `i18n.js`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Markup; generated blocks are filled by `app.js` |
| `style.css` | Styles, dark theme, responsive layout |
| `app.js` | Language switch, generated blocks, catalogue, gallery, link placeholders |
| `demo.js` | Interactive plugin demo |
| `tour.js` | Hover hints and the guided tour over the demo |
| `i18n.js` | EN / RU strings, including hints and tour steps |
| `modules-data.js` | Offline snapshot of the module manifest |
| `assets/` | Logo, favicon, screenshots (`shots/`) |
| `tools/check_site.py` | Headless check (Playwright): console errors, both languages, every demo path, mobile |
| `tools/geometry.py` | Layout numbers at 1366 / 390 px (overflow, section heads, frame width) + full-page shots |
| `tools/publish.py` | Mirrors this folder into the GitHub Pages repository and pushes |
| `tools/make_modules_data.py` | Regenerates `modules-data.js` from a manifest file or URL |
| `modules-README.md` | Bilingual README for the `flbridge-modules` repository |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Links to fill in

`LINKS` at the top of `app.js`: `buy`, `donate`, `download`, `downloadModules`. An empty string
renders the button as *coming soon*.

## Local run and check

```
python -m http.server 8000          # from this folder, then open http://localhost:8000/
python tools/check_site.py          # or: python tools/check_site.py http://localhost:8000/
```

The check needs `pip install playwright` and `playwright install chromium` (falls back to the
Edge channel).

## Publishing

Live at **https://broscauk.github.io/flbridge/** — GitHub Pages serves the public repository
[broscauk/flbridge](https://github.com/broscauk/flbridge) (branch `main`, root). This folder is the
source; the repository is a mirror of it.

```
python tools/publish.py "what changed"   # clone/update the mirror in %TEMP%, copy, commit, push
python tools/publish.py --dry-run        # show what would change
```

Everything here is pushed except `_check/` and `modules-README.md`. Pages rebuilds within a minute.

## Versions

- **v2** (2026-10-04) — tighter rhythm (15 px base, 40–72 px sections, two-column section heads,
  4-up gallery), scrollbars in the frame's palette on every scroller, scroll-progress hairline under
  the header, status pill in the hero; the demo frame no longer shrinks twice on phones. First
  publication to GitHub Pages.
- **v1** (2026-10-03) — initial page, interactive demo, tour and hints, live catalogue.

---

# Русский

[English](#fl-bridge--product-page) · **Русский**

Статическая страница продукта **FL Bridge** — VST3-хоста, который запускает нативные плагины
FL Studio в любой DAW. Собрана под GitHub Pages: без сборки и фреймворков — `index.html`, один
файл стилей, три скрипта.

## Что на странице

- Шапка, сетка возможностей, галерея с лайтбоксом, FAQ, блоки загрузки / покупки / доната, контакты.
- **Интерактивное демо** (`demo.js`) — рабочий макет настоящей рамы 1.0: поиск модулей (`Ctrl+F`),
  макро-ручки с обучением касанием и Матрица, A/B, пресеты, настройки (масштаб, акцент, положение
  макросов), панель MODULES с загрузками и *install all missing*, About.
- **Экскурсия и подсказки** (`tour.js`) — у каждого элемента рамы подсказка по наведению на языке
  страницы; экскурсия из 18 шагов сама управляет демо (открывает палитру, загружает модуль,
  связывает макрос, перекрашивает раму…) и объясняет каждый элемент. Карточки возможностей ведут
  к соответствующему шагу.
- **Живой каталог модулей** — читается из `manifest.json` в
  [flbridge-modules](https://github.com/broscauk/flbridge-modules) (сначала jsDelivr, потом raw
  GitHub). `modules-data.js` — офлайн-снимок, чтобы таблица никогда не была пустой.
- **Два языка**, английский основной. Выбор: `?lang=en|ru`, затем `localStorage`, затем
  `navigator.language`. Все строки — в `i18n.js`.

## Файлы

| Файл | Назначение |
|---|---|
| `index.html` | Разметка; генерируемые блоки заполняет `app.js` |
| `style.css` | Стили, тёмная тема, адаптив |
| `app.js` | Переключение языка, генерируемые блоки, каталог, галерея, заглушки ссылок |
| `demo.js` | Интерактивное демо плагина |
| `tour.js` | Подсказки по наведению и экскурсия по демо |
| `i18n.js` | Строки EN / RU, включая подсказки и шаги экскурсии |
| `modules-data.js` | Офлайн-снимок манифеста модулей |
| `assets/` | Логотип, favicon, снимки (`shots/`) |
| `tools/check_site.py` | Headless-проверка (Playwright): ошибки консоли, оба языка, все пути демо, мобильная вёрстка |
| `tools/geometry.py` | Числа вёрстки на 1366 / 390 px (переполнение, шапки секций, ширина рамы) + снимки страницы |
| `tools/publish.py` | Зеркалит папку в репозиторий GitHub Pages и пушит |
| `tools/make_modules_data.py` | Пересобирает `modules-data.js` из файла или URL манифеста |
| `modules-README.md` | Двуязычный README для репозитория `flbridge-modules` |
| `.nojekyll` | Просит GitHub Pages отдавать файлы как есть |

## Ссылки, которые надо заполнить

`LINKS` в начале `app.js`: `buy`, `donate`, `download`, `downloadModules`. Пустая строка рисует
кнопку как *coming soon*.

## Локальный запуск и проверка

```
python -m http.server 8000          # из этой папки, затем открыть http://localhost:8000/
python tools/check_site.py          # или: python tools/check_site.py http://localhost:8000/
```

Проверке нужны `pip install playwright` и `playwright install chromium` (есть откат на канал Edge).

## Публикация

Живёт по адресу **https://broscauk.github.io/flbridge/** — GitHub Pages отдаёт публичный репозиторий
[broscauk/flbridge](https://github.com/broscauk/flbridge) (ветка `main`, корень). Исходник — эта
папка; репозиторий — её зеркало.

```
python tools/publish.py "что изменилось"   # клон/обновление зеркала в %TEMP%, копия, коммит, push
python tools/publish.py --dry-run           # показать, что изменится
```

Уходит всё, кроме `_check/` и `modules-README.md`. Pages пересобирается в пределах минуты.

## Версии

- **v2** (2026-10-04) — плотнее ритм (база 15 px, секции 40–72 px, шапки секций в две колонки,
  галерея по четыре), скроллбары в палитре рамы на каждой прокрутке, полоса прогресса под шапкой,
  пилюля-статус в hero; рама демо больше не ужимается дважды на телефонах. Первая публикация на
  GitHub Pages.
- **v1** (2026-10-03) — первая страница, интерактивное демо, экскурсия и подсказки, живой каталог.
