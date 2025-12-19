# Estágio de Dependências
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Estágio de Build
FROM node:20-alpine AS builder
# Adiciona openssl necessário para o Prisma durante o build (prerender)
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1

# Gera o cliente Prisma com os binaryTargets corretos
RUN npx prisma generate
RUN npm run build

# Estágio de Execução
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Garante que o runner tenha o runtime do openssl e compatibilidade
RUN apk add --no-cache openssl libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Install Prisma CLI and Client locally to ensure generator is available
RUN npm install prisma@5.22.0 @prisma/client@5.22.0 && chown -R nextjs:nodejs /app/node_modules

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["./start.sh"]