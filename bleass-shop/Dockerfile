FROM node:20-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy backend first
COPY bleass-backend/package*.json ./bleass-backend/

# Install backend deps (node:20-slim has prebuilt binaries)
RUN cd bleass-backend && npm install --omit=dev

# Copy root package files and install
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source
COPY . .

# Expose medusa default port
EXPOSE 9000

# Start medusa
CMD ["sh", "-c", "cd bleass-backend && ./node_modules/.bin/medusa start"]
