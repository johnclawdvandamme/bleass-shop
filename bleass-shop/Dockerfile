FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# === Backend ===
COPY bleass-backend/package*.json ./bleass-backend/
COPY bleass-backend/pnpm-lock.yaml ./bleass-backend/pnpm-lock.yaml 2>/dev/null || true
WORKDIR /app/bleass-backend
RUN pnpm install --prefer-offline 2>&1 || pnpm install 2>&1

# === Root ===
WORKDIR /app
COPY package*.json ./
RUN pnpm install --prefer-offline 2>&1 || pnpm install 2>&1

# === Source ===
COPY . .

EXPOSE 9000

CMD ["sh", "-c", "cd bleass-backend && ./node_modules/.bin/medusa start"]
