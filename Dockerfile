# ========================================================
# Nineteen99 Core Backend - Production Container Manifest
# ========================================================

# Step 1: Use an optimized, secure lightweight Node environment
FROM node:20-alpine AS runner

# Step 2: Establish isolated application tracking directory
WORKDIR /app/backend

# Step 3: Copy dependency configuration maps
COPY backend/package*.json ./

# Step 4: Install clean production dependencies strictly
RUN npm ci --only=production

# Step 5: Copy core engine ledger source modules
COPY backend/ ./

# Step 6: Expose the core network communication interface port
EXPOSE 5000

# Step 7: Define environment variable fallbacks
ENV NODE_ENV=production
ENV PORT=5000

# Step 8: Boot up the transactional engine microservice
CMD ["node", "server.js"]
