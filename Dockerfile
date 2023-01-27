FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN apk add  --no-cache \
    g++ make py3-pip \
    libpng libpng-dev jpeg-dev \
    pango-dev cairo-dev giflib-dev

RUN pnpm install

# Build the app
RUN pnpm run build

CMD ["node", "dist/src/index.js"]
