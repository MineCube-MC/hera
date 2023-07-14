FROM oven/bun:canary

WORKDIR /opt/app

COPY . .

RUN bun install

CMD ["bun", "run", "src/index.ts"]