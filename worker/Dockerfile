FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY worker/package.json ./worker/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY worker/ ./worker/
RUN pnpm --filter @liftivity/worker build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /repo/worker/dist ./dist
COPY --from=builder /repo/worker/package.json ./
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
