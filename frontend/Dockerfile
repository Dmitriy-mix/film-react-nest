# ---- Этап сборки ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Этап с готовой статикой ----
FROM alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["sh", "-c", "tail -f /dev/null"]