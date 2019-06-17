#!/bin/sh

apk add --no-cache bash git py-pip make && \
rm -rf .git && \
npm i --no-package-lock && \
npm run build && \
npm install node-dev@3.1.3 -g && \
./docker/node-modules-clean.sh
npm dedupe && \
npm cache clean --force && \
apk del git py-pip make
