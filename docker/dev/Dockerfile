ARG IMAGE=node:13.13-alpine
FROM $IMAGE as builder

WORKDIR /app

RUN apk add --no-cache bash curl git py-pip make && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
  npm install node-dev -g && npm cache clean --force

FROM builder

COPY docker ./docker
COPY .npmr[c] package.json package-lock.json ./
COPY eslint eslint

RUN chmod +x ./docker/node-modules-clean.sh

RUN npm ci && npm cache clean --force && \
  ./docker/node-modules-clean.sh && \
  npm dedupe && \
  rm -f .npmrc

COPY . .
RUN npm run build

#FOR SWC TRANSPILATION
# RUN npm run build-swc
# COPY package.json ./build/package.json

COPY .env.dist ./build/.env.dist
COPY ./swagger ./swagger