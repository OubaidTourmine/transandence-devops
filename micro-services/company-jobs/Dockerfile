FROM node:22-bookworm

WORKDIR /app

# 1. Copy dependencies and Prisma configuration
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# 2. Install dependencies
RUN DATABASE_URL="postgresql://build:build@localhost:5432/builddb" npm ci

# 3. Copy application source
COPY tsconfig.json ./
COPY src ./src

# 4. Generate Prisma Client and compile TypeScript
RUN DATABASE_URL="postgresql://build:build@localhost:5432/builddb" npm run build

# 5. Expose Express port
EXPOSE 3000

# 6. Start the compiled application

CMD ["npm", "start"]