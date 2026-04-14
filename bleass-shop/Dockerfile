FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# === Backend: copy + install with max speed flags ===
COPY bleass-backend/package*.json ./bleass-backend/
WORKDIR /app/bleass-backend
RUN npm install --omit=dev --no-audit --no-fund --prefer-offline 2>&1 || \
    npm install --omit=dev --no-audit --no-fund 2>&1

# === Root ===
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# === Source ===
COPY . .

EXPOSE 9000

CMD ["sh", "-c", "cd bleass-backend && ./node_modules/.bin/medusa start"]
