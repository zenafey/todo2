# Веб-приложение "Список задач" - Документация

## Обзор проекта

Это полнофункциональное веб-приложение для управления задачами, построенное на современном стеке технологий:

- **Backend**: FastAPI (Python) с JWT аутентификацией
- **Frontend**: Next.js 15 (React) с TypeScript
- **База данных**: SQLite с SQLAlchemy ORM
- **Стилизация**: Tailwind CSS
- **Аутентификация**: JWT токены с HTTP-only cookies

## Архитектура проекта

```
├── backend/
│   ├── __init__.py
│   ├── auth.py          # Модуль аутентификации
│   ├── crud.py          # CRUD операции с БД
│   ├── database.py      # Конфигурация базы данных
│   ├── main.py          # Основной файл FastAPI приложения
│   ├── models.py        # SQLAlchemy модели
│   └── schemas.py       # Pydantic схемы
└── frontend/todo-nextjs/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   ├── login/
    │   │   │   └── register/
    │   │   ├── (main)/
    │   │   │   └── page.tsx
    │   │   ├── api/
    │   │   │   └── tasks/
    │   │   ├── globals.css
    │   │   └── layout.tsx
    │   ├── components/
    │   │   └── TaskList.tsx
    │   └── middleware.ts
    └── package.json
```

## Backend (FastAPI)

### Основные компоненты

#### 1. Модели данных (`models.py`)

**User (Пользователь)**
- `id`: Уникальный идентификатор
- `email`: Email пользователя (уникальный)
- `hashed_password`: Хэшированный пароль
- `tasks`: Связь с задачами пользователя

**Task (Задача)**
- `id`: Уникальный идентификатор
- `title`: Название задачи
- `description`: Описание задачи (опционально)
- `status`: Статус выполнения (boolean)
- `created_at`: Дата создания
- `owner_id`: ID владельца задачи

#### 2. Схемы Pydantic (`schemas.py`)

- `TaskBase`, `TaskCreate`, `TaskUpdate`, `Task` - схемы для задач
- `UserBase`, `UserCreate`, `User` - схемы для пользователей
- `Token`, `TokenData` - схемы для JWT токенов

#### 3. Аутентификация (`auth.py`)

**Основные функции:**
- `verify_password()` - проверка пароля
- `get_password_hash()` - хэширование пароля
- `create_access_token()` - создание JWT токена
- `get_current_user()` - получение текущего пользователя из токена
- `get_token_from_cookie()` - извлечение токена из cookie

**Настройки безопасности:**
- Алгоритм: HS256
- Время жизни токена: 3000 минут
- HTTP-only cookies для безопасности

#### 4. CRUD операции (`crud.py`)

**Пользователи:**
- `get_user()` - получение пользователя по ID
- `get_user_by_email()` - получение пользователя по email
- `create_user()` - создание нового пользователя

**Задачи:**
- `get_tasks()` - получение задач пользователя
- `create_user_task()` - создание новой задачи
- `update_task()` - обновление задачи
- `delete_task()` - удаление задачи

#### 5. API Endpoints (`main.py`)

**Аутентификация:**
- `POST /token` - вход в систему
- `POST /logout` - выход из системы
- `POST /users/` - регистрация нового пользователя
- `GET /users/me/` - получение информации о текущем пользователе

**Управление задачами:**
- `POST /tasks/` - создание задачи
- `GET /tasks/` - получение списка задач
- `PUT /tasks/{task_id}` - обновление задачи
- `DELETE /tasks/{task_id}` - удаление задачи

### CORS настройки

Настроено для работы с frontend на `localhost:3000` и `127.0.0.1:3000`.

## Frontend (Next.js)

### Структура приложения

#### 1. App Router структура

- `(auth)/` - группа маршрутов для аутентификации
- `(main)/` - основная группа маршрутов
- `api/` - API routes для проксирования запросов к backend

#### 2. Middleware (`middleware.ts`)

**Функциональность:**
- Проверка наличия JWT токена в cookies
- Перенаправление неаутентифицированных пользователей на `/login`
- Перенаправление аутентифицированных пользователей с `/login` на главную

#### 3. Страницы

**Страница входа (`login/page.tsx`):**
- Форма аутентификации
- Отправка данных в формате `application/x-www-form-urlencoded`
- Обработка ошибок аутентификации

**Страница регистрации (`register/page.tsx`):**
- Форма создания нового аккаунта
- Валидация email и пароля
- Автоматическое перенаправление после успешной регистрации

**Главная страница (`page.tsx`):**
- Server-side рендеринг списка задач
- Передача данных в клиентский компонент
- Сортировка задач по дате создания

#### 4. Компоненты

**TaskList (`TaskList.tsx`):**
- Управление состоянием задач
- Добавление новых задач
- Переключение статуса задач
- Удаление задач
- Фильтрация по статусу (все/активные/завершенные)

#### 5. API Routes

**`/api/tasks/route.ts`:**
- Проксирование POST запросов для создания задач
- Автоматическая передача JWT токена из cookies

**`/api/tasks/[id]/route.ts`:**
- Проксирование PUT/DELETE запросов для конкретных задач
- Обработка динамических маршрутов

### Особенности реализации

#### Server-Side Rendering (SSR)
- Задачи загружаются на сервере для быстрого отображения
- Использование `cookies()` для получения токена на сервере
- Fallback на клиентское управление состоянием

#### Состояние клиента
- Локальное состояние для списка задач
- Обновления UI
- Обработка ошибок с пользовательскими уведомлениями

## Безопасность

### Аутентификация
- JWT токены с подписью HS256
- HTTP-only cookies для защиты от XSS
- Автоматическое истечение токенов

### Авторизация
- Проверка владельца для всех операций с задачами
- Middleware для защиты маршрутов
- Валидация на уровне API

### Хэширование паролей
- Использование bcrypt через passlib
- Соль добавляется автоматически

## Настройка и запуск

### Backend

1. **Установка зависимостей:**
```bash
cd backend
pip install fastapi uvicorn sqlalchemy sqlite3 passlib python-jose bcrypt python-multipart
```

2. **Запуск сервера:**
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

1. **Установка зависимостей:**
```bash
cd frontend/todo-nextjs
npm install
```

2. **Настройка переменных окружения:**
```bash
# .env.local
FASTAPI_URL=http://127.0.0.1:8000
```

3. **Запуск приложения:**
```bash
npm run dev
```

## Особенности конфигурации

### Next.js (`next.config.ts`)
- Разрешенные dev origins для безопасности
- Отключение dev индикаторов

### Tailwind CSS
- Использование Tailwind CSS v4
- PostCSS конфигурация

### TypeScript
- Strict режим включен
- Path mapping для удобства импортов (`@/*`)

## API Спецификация

### Аутентификация

#### POST /token
Вход в систему

**Request:**
```
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secretpassword
```

**Response:**
```json
{
  "message": "Login successful"
}
```

#### POST /users/
Регистрация пользователя

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "tasks": []
}
```

### Управление задачами

#### GET /tasks/
Получение списка задач пользователя

**Response:**
```json
[
  {
    "id": 1,
    "title": "Купить продукты",
    "description": "Молоко, хлеб, яйца",
    "status": false,
    "created_at": "2024-01-01T12:00:00Z",
    "owner_id": 1
  }
]
```

#### POST /tasks/
Создание новой задачи

**Request:**
```json
{
  "title": "Новая задача",
  "description": "Описание задачи"
}
```

#### PUT /tasks/{task_id}
Обновление задачи

**Request:**
```json
{
  "title": "Обновленное название",
  "description": "Новое описание",
  "status": true
}
```

#### DELETE /tasks/{task_id}
Удаление задачи

**Response:** 204 No Content

## Заключение

Веб приложение представляет собой современное полнофункциональное приложение с продуманной архитектурой, безопасной аутентификацией и удобным пользовательским интерфейсом. Код структурирован для легкого масштабирования и поддержки.
