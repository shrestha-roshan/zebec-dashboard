# Install dependencies only when needed

FROM node:16-alpine as env-setter

ARG RPC_NETWORK
ARG DB_HOST
ARG NOTIFI_CARD_ID
ARG ZBC_AIRDROP
ARG SYNDICA_API
ARG NODE_ENV
ARG SDK_ENV
ARG PROGRAM_ID
ARG FEE_RECEIVER_WALLET

ENV RPC_NETWORK=$RPC_NETWORK
ENV DB_HOST=$DB_HOST
ENV NOTIFI_CARD_ID=$NOTIFI_CARD_ID
ENV ZBC_AIRDROP=$ZBC_AIRDROP
ENV SYNDICA_API=$SYNDICA_API
ENV NODE_ENV=$NODE_ENV
ENV PROGRAM_ID=$PROGRAM_ID
ENV FEE_RECEIVER_WALLET=$FEE_RECEIVER_WALLET
ENV SDK_ENV=$SDK_ENV

FROM env-setter AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./


RUN \
  if [ -f yarn.lock ]; then NODE_ENV=development yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi



# Rebuild the source code only when needed
FROM env-setter AS builder


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM env-setter AS runner
WORKDIR /app

RUN npm i -g sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
