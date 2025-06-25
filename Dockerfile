# Multi-stage build для оптимизации размера образа
FROM node:18-alpine AS frontend-builder

# Устанавливаем рабочую директорию для фронтенда
WORKDIR /app/frontend

# Копируем package.json и устанавливаем зависимости
COPY frontend/todo-nextjs/package*.json ./
RUN npm ci

# Копируем исходный код фронтенда
COPY frontend/todo-nextjs/ ./

# Билдим Next.js приложение
RUN npm run build

# Основной образ для продакшена
FROM python:3.11-slim

# Устанавливаем Node.js для запуска Next.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Создаем рабочую директорию
WORKDIR /app

# Копируем и устанавливаем Python зависимости
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Копируем backend код
COPY backend/ ./backend/

# Копируем собранный фронтенд из builder стадии
COPY --from=frontend-builder /app/frontend ./frontend

# Устанавливаем переменные окружения
ENV FASTAPI_URL=http://127.0.0.1:8000
ENV PYTHONPATH=/app/backend

# Открываем порты
EXPOSE 3000 8000

# Создаем скрипт запуска
RUN echo '#!/bin/bash\n\
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
cd /app/frontend && npm start -- --hostname 0.0.0.0 --port 3000\n\
' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]