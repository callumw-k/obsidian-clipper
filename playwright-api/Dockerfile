FROM node:lts-bookworm AS base


FROM base AS builder
WORKDIR /app
COPY package*json tsconfig.json ./
COPY src ./

RUN npm ci && \
    npm run build && \
    npm prune --production



FROM base AS runner
WORKDIR /app

ENV PLAYWRIGHT_BROWSERS_PATH=/app/pw-browsers
RUN npx -y playwright@1.49.1 install --with-deps chromium --only-shell

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json


COPY ./seccomp_profile.json /seccomp_profile.json

RUN chown -R hono:nodejs /app/pw-browsers

USER hono

EXPOSE 3000
CMD ["node", "/app/dist/index.js"]
