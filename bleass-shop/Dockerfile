FROM medusajs/medusa:latest

WORKDIR /app

# Copy entire project (root is the storefront, bleass-backend/ is the medusa project)
COPY . .

# Expose medusa port
EXPOSE 9000

# Start medusa from the backend directory
CMD ["sh", "-c", "cd bleass-backend && medusa start"]
