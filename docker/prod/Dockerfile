ARG IMAGE=node:20-alpine

FROM $IMAGE as build

WORKDIR /app
COPY . .

RUN apk add --no-cache bash curl git py-pip make
RUN npm i
RUN npm run build
#FOR SWC TRANSPILATION
# RUN npm run build-swc
# COPY package.json ./build/package.json

RUN npm prune --production
RUN chmod +x ./docker/node-modules-clean.sh
RUN ./docker/node-modules-clean.sh
RUN npx node-prune
RUN chown -R root:root /app

FROM $IMAGE
COPY --chown=node:node --from=build /app/build /app/build
COPY --chown=node:node --from=build /app/graphql /app/graphql
COPY --chown=node:node --from=build /app/swagger /app/swagger
COPY --chown=node:node --from=build /app/.env.dist /app/build/.env.dist
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
ENV NODE_ENV production
ENTRYPOINT ["node", "./src/index.js"]
WORKDIR /app/build
CMD [""]

USER node
