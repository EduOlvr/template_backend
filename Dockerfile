FROM node:22-alpine3.20 AS build

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Production Stage
FROM node:22-alpine3.20

RUN apk add --no-cache \
  dumb-init \
  curl \
  ca-certificates \
  && apk upgrade --no-cache \
  && update-ca-certificates

RUN npm install -g pnpm

WORKDIR /usr/src/app

RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package.json ./
COPY --from=build --chown=nestjs:nodejs /usr/src/app/pnpm-lock.yaml ./
COPY --from=build --chown=nestjs:nodejs /usr/src/app/config ./config

RUN pnpm install --prod

ENV NODE_ENV=production
EXPOSE 4000

USER nestjs

CMD ["dumb-init", "node", "dist/main"]
