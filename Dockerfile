FROM oven/bun

WORKDIR /opt/app

COPY . .

RUN bun install

CMD ["bun", "run", "src/index.ts"]