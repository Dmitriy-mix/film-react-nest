# FILM!

## Деплой
Проект доступен по адресу: http://46.21.246.228/

## Технологии
- Фронтенд: React, Vite
- Бэкенд: NestJS, TypeORM
- База данных: PostgreSQL
- Администрирование БД: pgAdmin
- Контейнеризация: Docker, Docker Compose
- CI/CD: GitHub Actions (публикация образов в GHCR)
- Логирование: DevLogger, JsonLogger, TskvLogger (выбор через LOGGER_TYPE)

## Запуск проекта (Docker Compose)

### Предварительные требования
- Установленный Docker и Docker Compose.
- Файл .env в корне проекта (создайте его на основе .env.example).

### 1. Настройка переменных окружения
Скопируйте пример заполнения:
    cp .env.example .env

В файле .env задайте свои значения для DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME, а также пароли для pgAdmin.

Пример содержимого .env:
```
  PORT=3000
  DATABASE_DRIVER=postgres
  DATABASE_URL=postgres://exampleuser:examplepassword@postgres:5432/exampledb
  DATABASE_HOST=postgres
  DATABASE_PORT=5432
  DATABASE_USERNAME=exampleuser
  DATABASE_PASSWORD=examplepassword
  DATABASE_NAME=exampledb
  PGADMIN_EMAIL=admin@admin.com
  PGADMIN_PASSWORD=admin
  LOGGER_TYPE=dev
```

### 2. Запуск приложения
Соберите и запустите контейнеры:
    docker compose up -d --build

Проверьте статус:
    docker compose ps

Все пять сервисов (postgres, pgadmin, backend, frontend, nginx) должны быть в статусе Up.

### 3. Наполнение базы данных (первый запуск)
После запуска база пустая. Выполните SQL-скрипты из папки backend/test/.

Скопируйте скрипты в контейнер и выполните по очереди:
    docker cp backend/test/prac.init.sql film_postgres:/tmp/
    docker exec -it film_postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} -f /tmp/prac.init.sql

    docker cp backend/test/prac.films.sql film_postgres:/tmp/
    docker exec -it film_postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} -f /tmp/prac.films.sql

    docker cp backend/test/prac.shedules.sql film_postgres:/tmp/
    docker exec -it film_postgres psql -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} -f /tmp/prac.shedules.sql

### 4. Доступ к приложению
- Фронтенд: http://localhost/
- API: http://localhost/api/afisha/films/
- pgAdmin: http://localhost:8080 (логин/пароль из .env)

## Запуск бэкенда без Docker (для разработки)
1. Перейдите в папку бэкенда: cd backend
2. Установите зависимости: npm ci
3. Создайте .env на основе .env.example (укажите DATABASE_HOST=127.0.0.1 для локальной БД).
4. Запустите: npm run start:dev

## Тестирование
Запуск тестов:
    cd backend
    npm test

## CI/CD и публикация образов
В репозитории настроен GitHub Actions (.github/workflows/deploy.yml), который при пуше в ветку main (или review-2) собирает Docker-образы и публикует их в GitHub Container Registry (ghcr.io/dmitriy-mix/...).

## Структура проекта
- backend/ — исходный код бэкенда (NestJS), тесты, SQL-скрипты.
- frontend/ — исходный код фронтенда (React).
- nginx/ — конфигурация Nginx.
- .github/workflows/ — файлы CI/CD.
- docker-compose.yml — описание сервисов.
- .env.example — пример переменных окружения.
