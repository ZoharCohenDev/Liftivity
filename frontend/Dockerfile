FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/ui/package.json ./packages/ui/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile
COPY packages/ ./packages/
COPY frontend/ ./frontend/
RUN pnpm --filter @liftivity/web build

FROM nginx:alpine
COPY --from=builder /repo/frontend/dist /usr/share/nginx/html
EXPOSE 80
