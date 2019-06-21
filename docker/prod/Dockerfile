ARG IMAGE=node:12.1.0-alpine

FROM $IMAGE as build

WORKDIR /app
COPY . .

RUN apk add --no-cache curl git py-pip make && \
    curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
    npm i typescript@3.2.2 -g && \
    npm i && \
    npm run build && \
    rm -rf node_modules && \
    npm i --production && \
    ./docker/node-modules-clean.sh && \
    ./bin/node-prune

FROM $IMAGE
COPY --from=build /app/build /app/build
COPY --from=build /app/.env.dist /app/build/.env.dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/docker/prod/docker_entrypoint.sh /docker_entrypoint.sh
ENTRYPOINT [ "/docker_entrypoint.sh" ]
CMD [""]


