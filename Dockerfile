FROM node:latest

WORKDIR /app

COPY package.json .

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linux-x64" && chmod +x /bin/pnpm

RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN pnpm install

RUN pnpm run build

CMD ["node", "dist/src/index.js"]
