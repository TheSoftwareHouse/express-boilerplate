ARG IMAGE=node:12.1.0-alpine
FROM $IMAGE as builder

WORKDIR /app
COPY . .

RUN ./docker/npm_install.sh

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

