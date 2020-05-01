ARG IMAGE=node:13.13-alpine

FROM $IMAGE as build

WORKDIR /app
COPY . .

RUN apk add --no-cache curl git py-pip make && \
  npm config set unsafe-perm true && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh && \
  npm i && \
  npm run build && \
  rm -rf node_modules && \
  npm i --production && \
  ./docker/node-modules-clean.sh && \
  ./bin/node-prune

FROM $IMAGE
COPY --chown=node:node --from=build /app/build /app/build
COPY --chown=node:node --from=build /app/graphql /app/graphql
COPY --chown=node:node --from=build /app/.env.dist /app/build/.env.dist
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/docker/prod/docker_entrypoint.sh /docker_entrypoint.sh
RUN chmod +x /docker_entrypoint.sh
ENTRYPOINT [ "/docker_entrypoint.sh" ]
WORKDIR /app/build
CMD [""]

USER node
