# builder
FROM node:18 AS builder

RUN npm install -g pnpm@8.9.2

WORKDIR /app

COPY . .

RUN pnpm i && pnpm tsc

RUN ls -al

# CMD "/bin/sh" "-c" "pwd && ls -al"

# final stage
FROM node:18-alpine

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/ ./prisma

RUN npm install -g pnpm@8.9.2 && pnpm i --frozen-lockfile

EXPOSE 8080

CMD "node" "dist/index.js"