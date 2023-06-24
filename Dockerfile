FROM oven/bun

COPY . .

RUN bun install --production

CMD ["bun", "run", "src/index.ts"]