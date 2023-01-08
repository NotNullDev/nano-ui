# Install dependencies only when needed
FROM node:18.12.1-alpine AS node_modules
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

FROM node:18.12.1-bullseye AS builder

WORKDIR /app

COPY . .
COPY --from=node_modules /app/node_modules ./node_modules

ARG NEXT_TELEMETRY_DISABLED 1
ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM node:18.12.1-alpine3.16 AS runner
WORKDIR /app

USER root

ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

EXPOSE 3000
CMD [ "node", "server.js", "--hostname", "0.0.0.0" ]