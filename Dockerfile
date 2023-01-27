FROM node:latest

WORKDIR /app

COPY package.json .

COPY . .

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

RUN source ~/.bashrc

RUN apt update && apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

RUN pnpm install

# Build the app
RUN pnpm run build

CMD ["node", "dist/src/index.js"]
