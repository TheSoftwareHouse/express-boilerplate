ARG IMAGE=node:20-alpine
FROM $IMAGE as builder

WORKDIR /app

RUN apk add --no-cache bash curl git py-pip make && \
  npx node-prune && \
  npm cache clean --force
  
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