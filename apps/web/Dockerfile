# Stage 1: Dependências (com devDependencies para build)
FROM node:24.4.1-bullseye AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm rebuild lightningcss

# Stage 2: Build
FROM node:24.4.1-bullseye AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner (sem devDependencies, mais leve)
FROM node:24.4.1-bullseye AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copia apenas o necessário
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

# Instala apenas dependências necessárias para produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --include=optional && npm rebuild lightningcss

USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start"]
