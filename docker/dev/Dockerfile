ARG IMAGE=node:12.13-alpine
FROM $IMAGE as builder

WORKDIR /app

RUN apk add --no-cache bash curl git py-pip make && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
  npm install node-dev@3.1.3 -g && npm cache clean --force

FROM builder

COPY docker ./docker
COPY .npmr[c] package.json package-lock.json ./

RUN npm ci && npm cache clean --force && \
  ./docker/node-modules-clean.sh && \
  npm dedupe && \
  rm -f .npmrc

COPY . .
RUN npm run build