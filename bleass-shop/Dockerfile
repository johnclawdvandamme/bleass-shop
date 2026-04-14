FROM node:20-alpine

WORKDIR /app

# Copy backend first (most likely to change)
COPY bleass-backend/package*.json ./bleass-backend/

# Install backend dependencies (including dev for build tools)
RUN cd bleass-backend && npm install

# Copy and install root dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source
COPY . .

# Expose medusa
EXPOSE 9000

# Start medusa
CMD ["sh", "-c", "cd bleass-backend && ./node_modules/.bin/medusa start"]
