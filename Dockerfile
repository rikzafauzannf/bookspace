# Multi-stage Dockerfile for Monorepo
FROM oven/bun:1 AS base
WORKDIR /app

# Copy lockfile and package definitions
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/
COPY packages/api-client/package.json ./packages/api-client/
COPY mini-services/websocket-service/package.json ./mini-services/websocket-service/

# Install pnpm to handle workspaces properly
RUN bun install -g pnpm && pnpm install --frozen-lockfile

# Copy all source files
COPY . .

# Build step
RUN pnpm build

# Stage for API
FROM oven/bun:1 AS api
WORKDIR /app
COPY --from=base /app ./
EXPOSE 3001
CMD ["bun", "run", "--cwd", "apps/api", "start:prod"]

# Stage for Web
FROM oven/bun:1 AS web
WORKDIR /app
COPY --from=base /app ./
EXPOSE 3000
CMD ["bun", "run", "--cwd", "apps/web", "start"]
