FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN apk add  --no-cache \
    g++ make py3-pip \
    libpng libpng-dev jpeg-dev \
    pango-dev cairo-dev giflib-dev \
    terminus-font ttf-inconsolata ttf-dejavu font-noto font-noto-cjk ttf-font-awesome font-noto-extra \
    font-vollkorn font-misc-cyrillic font-mutt-misc font-screen-cyrillic font-winitzki-cyrillic font-cronyx-cyrillic \
    font-noto-thai font-noto-tibetan font-ipa font-sony-misc font-daewoo-misc font-jis-misc

RUN pnpm install

# Build the app
RUN pnpm run build

CMD ["node", "dist/src/index.js"]
