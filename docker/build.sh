#!/bin/bash

docker build -t app:latest --target builder -f ./docker/dev/Dockerfile . && \
docker build -t app-service:latest --target service -f ./docker/dev/Dockerfile .

