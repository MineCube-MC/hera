FROM node:18-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN apk add  --no-cache \
    g++ make py3-pip \
    libpng libpng-dev jpeg-dev \
    pango-dev cairo-dev giflib-dev

RUN yarn install

# Build the app
RUN yarn run build

CMD ["node", "dist/src/index.js"]