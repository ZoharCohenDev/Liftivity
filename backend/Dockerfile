FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY backend/package.json ./backend/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY backend/ ./backend/
RUN pnpm --filter @liftivity/api build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /repo/backend/dist ./dist
COPY --from=builder /repo/backend/package.json ./
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["node", "dist/main.js"]
