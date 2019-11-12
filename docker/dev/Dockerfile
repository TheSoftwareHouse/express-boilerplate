ARG IMAGE=node:12.1.0-alpine
FROM $IMAGE as builder

WORKDIR /app

COPY docker ./docker
COPY .npmr[c] package.json package-lock.json ./

RUN npm config set unsafe-perm true
RUN apk add --no-cache bash curl git py-pip make && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
  npm install node-dev@3.1.3 -g && npm cache clean --force

RUN npm ci && npm cache clean --force && \
  ./docker/node-modules-clean.sh && npm dedupe

COPY . .
RUN npm run build

# BASE image that will share node_modules with service containers
FROM $IMAGE as base
WORKDIR /app
COPY --from=builder /app /app

## SERVICE container
FROM $IMAGE as service
WORKDIR /app
COPY --from=builder /app/build /app/build
COPY --from=builder /usr/local/lib/node_modules/node-dev /usr/local/lib/node_modules/node-dev
RUN ln -s /usr/local/lib/node_modules/node-dev/bin/node-dev /usr/local/bin/node-dev

