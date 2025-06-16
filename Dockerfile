# Etapa de build
FROM node:20-slim as builder

# Instala dependências nativas necessárias ao canvas e ao prisma
RUN apt-get update && apt-get install -y \
  build-essential \
  make \
  g++ \
  python3 \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o Prisma Client (importante que ocorra aqui, após openssl estar disponível)
RUN npx prisma generate

# Compila projeto
RUN npm run build

# Etapa final (runtime)
FROM node:20-slim

# Instala libs nativas necessárias para runtime
RUN apt-get update && apt-get install -y \
  libcairo2 \
  libpango-1.0-0 \
  libjpeg62-turbo \
  libgif7 \
  librsvg2-2 \
  openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY .env .env

CMD ["node", "dist/src/infra/main"]