FROM oven/bun

WORKDIR /opt/app

COPY . .

RUN bun install --production

CMD ["bun", "run", "src/index.ts"]