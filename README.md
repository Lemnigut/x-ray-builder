# Boolean X-Ray Builder

Клиентское приложение для генерации Boolean-запросов для X-Ray поиска профилей LinkedIn через Google.

## Пример результата

```
site:ru.linkedin.com/in intitle:developer OR intitle:разработчик "golang" "docker" "react" OR "vue" "Москва" -intitle:junior
```

## Стек

- React + TypeScript + Vite
- CSS Modules (тёмная тема)
- Без бекенда — вся логика на клиенте

## Запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`.

### Сборка для продакшена

```bash
npm run build
```

Результат в папке `dist/`.

## Возможности

- **Tag-input** — поля принимают несколько значений, удаление по крестику или Backspace
- **Автокомплит** — подсказки для Job Title, Skills и Location из статического списка; навигация стрелками
- **Генерация в реальном времени** — строка запроса обновляется при каждом изменении
- **Подсветка синтаксиса** — операторы `site:`, `intitle:`, `OR`, кавычки и исключения выделены цветом
- **Копирование** — кнопка копирует запрос в буфер обмена
- **Поиск в Google** — кнопка открывает Google с готовым запросом в новой вкладке

## Поля формы

| Поле | Оператор | Логика внутри группы |
|------|----------|---------------------|
| Регион | `site:XX.linkedin.com/in` | выпадающий список |
| Job Title | `intitle:value` | OR между значениями |
| Skills — AND | `"value"` | все обязательны (неявный AND) |
| Skills — OR | `"value"` | OR между значениями (любой из) |
| Location | `"value"` | в кавычках |
| Company | `intitle:value` | OR между значениями |
| Exclude | `-intitle:value` | убирает из заголовка профиля |

Между группами — неявный AND (пробел).

## Структура проекта

```
src/
├── main.tsx                          — точка входа
├── App.tsx                           — главный компонент с формой
├── App.module.css                    — стили приложения
├── types.ts                          — типы (FormState, Region)
├── components/
│   ├── TagInput/TagInput.tsx         — ввод тегов с автокомплитом
│   ├── RegionSelect/RegionSelect.tsx — выбор региона LinkedIn
│   └── QueryPreview/QueryPreview.tsx — отображение запроса с подсветкой
├── data/
│   └── suggestions.ts               — статические подсказки
└── utils/
    └── buildQuery.ts                 — сборка boolean-строки
```
