ARG IMAGE=node:12.1.0-alpine
FROM $IMAGE as builder

WORKDIR /app
COPY . .

RUN npm config set unsafe-perm true
RUN npm config set unsafe-perm true && \
    apk add --no-cache bash git py-pip make && \
    rm -rf .git && \
    npm i --no-package-lock && \
    npm run build && \
    npm install node-dev@3.1.3 -g && \
    ./docker/node-modules-clean.sh && \
    npm dedupe && \
    npm cache clean --force && \
    apk del git py-pip make

COPY .env.dist ./build/.env.dist

# BASE image that will share node_modules with service containers
FROM $IMAGE as base
WORKDIR /app
COPY --from=builder /app /app

## SERVICE container
FROM $IMAGE as service
WORKDIR /app
COPY . .
COPY --from=builder /app/build /app/build
COPY --from=builder /usr/local/lib/node_modules/node-dev /usr/local/lib/node_modules/node-dev
RUN ln -s /usr/local/lib/node_modules/node-dev/bin/node-dev /usr/local/bin/node-dev

