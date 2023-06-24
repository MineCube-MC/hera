FROM oven/bun

RUN apt update && apt install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY . .

RUN bun install --production

CMD ["bun", "run", "src/index.ts"]